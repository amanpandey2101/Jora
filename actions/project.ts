"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data: {
  name: string;
  key: string;
  description: string;
  orgId?: string;
}) {
  const resolvedClerkclient = await clerkClient();
  const { userId, orgId: authOrgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use provided orgId or fall back to auth orgId
  const targetOrgId = data.orgId || authOrgId;

  if (!targetOrgId) {
    throw new Error("No Organization Selected");
  }

  let membershipList: any = [];
  try {
    const response =
      await resolvedClerkclient.organizations.getOrganizationMembershipList({
        organizationId: targetOrgId,
      });
    membershipList = response.data; // Assuming `data` contains the membership list
  } catch (error) {
    throw new Error("Error fetching organization membership: " + error);
  }
  console.log("Membership List:", membershipList);

  // Find if the user is an admin in the organization
  const userMembership = membershipList?.find(
    (membership: any) => membership.publicUserData?.userId === userId
  );
  console.log("user Membership:", userMembership);
  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  // Create a new project in the database
  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: targetOrgId,
      },
    });
    
    return project;
  } catch (error: any) {
    throw new Error("Error creating project: " + error.message);
  }
}

export async function getProjects(orgId: any) {
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
  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function deleteProject(projectId: any) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
  }

  if (!orgId) {
    throw new Error("No organization selected. Please select an organization first.");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found or You don't have permission to delete");
  }
  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}

export async function getProject(projectId: string) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    return null;
  }

  // If orgId is available, verify it matches
  // If orgId is not set (null/undefined), allow access
  // This handles cases where org context isn't fully initialized
  if (orgId && project.organizationId !== orgId) {
    return null;
  }

  return project;
}
