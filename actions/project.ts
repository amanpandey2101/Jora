"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data: {
  name: string;
  key: string;
  description: string;
}) {
  const resolvedClerkclient = await clerkClient();
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  let membershipList: any = [];
  try {
    const response =
      await resolvedClerkclient.organizations.getOrganizationMembershipList({
        organizationId: orgId,
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
        organizationId: orgId,
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

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
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

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const project = await db.project.findMany({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  // console.log("Project:", project)
  if (!project) {
    return null;
  }
  if (project?.organizationId === orgId) {
    return project;
  } 
  else return project;
}
