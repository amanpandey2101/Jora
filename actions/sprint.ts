"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Utility function for authorization check
async function checkAuthorization() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }
  return { userId, orgId };
}

export async function createSprint(projectId: any, data: any) {
  const { userId, orgId } = await checkAuthorization();

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { sprints: { orderBy: { createdAt: "desc" } } },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED", // Default status for a new sprint
      projectId: projectId,
    },
  });

  return { success: true, sprint }; // Consistent return format
}

export async function updateSprintStatus(
  sprintId: any,
  newStatus: any,
  customStartDate?: Date,
  customEndDate?: Date
) {
  const { userId, orgId, orgRole } = await auth();

  try {
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    // Handle start and end dates
    const startDate = customStartDate ? new Date(customStartDate) : new Date(sprint.startDate);
    const endDate = customEndDate ? new Date(customEndDate) : new Date(sprint.endDate);
    const now = new Date();

    // Validation logic based on the new status
    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    // Update sprint status
    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error: any) {
    throw new Error(error.message); // More explicit error handling
  }
}
