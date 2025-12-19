"use server";

import db from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string) {
  const resolvedClerkclient = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!userId) {
    throw new Error("User not found");
  }

  const organization = resolvedClerkclient.organizations.getOrganization({
    slug,
  });

  if (!organization) {
    return null;
  }

  const { data: membership } =
    await resolvedClerkclient.organizations.getOrganizationMembershipList({
      organizationId: (await organization).id,
    });

  const userMembership = membership.find(
    (member: any) => member.publicUserData.userId === userId
  );

  if (!userMembership) {
    return null;
  }
  return organization;
}

export async function getOrganizationUsers(orgId: string) {
  const resolvedClerkclient = await clerkClient();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const organizationMemberships:any =
    resolvedClerkclient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships?.data?.map(
    (membership: any) => membership.publicUserData.userId
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}

export async function getUserIssues(userId: string, orgId?: string) {
  const { orgId: currentOrgId } = await auth();

  // Use the provided orgId or fall back to the current user's orgId
  const targetOrgId = orgId || currentOrgId;
  
  if (!userId || !targetOrgId) {
    console.warn("Missing userId or orgId in getUserIssues:", { userId, orgId: targetOrgId });
    return []; // Return empty array instead of throwing error
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      console.warn("User not found for clerkUserId:", userId);
      return [];
    }

    const issues = await db.issue.findMany({
      where: {
        OR: [{ assigneeId: user.id }, { reporterId: user.id }],
        project: {
          organizationId: targetOrgId,
        },
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return issues;
  } catch (error) {
    console.error("Error fetching user issues:", error);
    return [];
  }
}

