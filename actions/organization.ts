"use server";

import db from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string) {
  const resolvedClerkclient = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

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

export async function getUserIssues(userId:any) {
  const { orgId } =  await auth();

  if (!userId || !orgId) {
    throw new Error("No user id or organization id found");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { reporterId: user.id }],
      project: {
        organizationId: orgId,
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
}

