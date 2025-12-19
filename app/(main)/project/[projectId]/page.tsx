import { getProject } from "@/actions/project";
import { notFound } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import SprintCreationForm from "../_components/SprintCreationForm";
import SprintBoard from "../_components/SprintBoard";

const ProjectPage = async ({ params }: any) => {
  const { projectId } = await params;

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const projectData = project;

  return (
    <div className="ml-50 relative top-20">
      <SprintCreationForm
        projectTitle={projectData.name}
        projectId={projectData.id}
        projectKey={projectData.key}
        sprintKey={(projectData.sprints?.length || 0) + 1}
      />
      {projectData.sprints?.length > 0 ? (
        <div className="mt-10">
          <SprintBoard
            sprints={projectData?.sprints}
            projectId={projectId}
            orgId={projectData?.organizationId}
            projectName={projectData.name}
            projectDescription={projectData.description}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 text-2xl font-bold mt-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl">🚀</div>
            <h2 className="text-3xl font-bold gradient-title">Ready to Start?</h2>
            <p className="text-lg text-gray-600 max-w-md">
              Create your first sprint to begin organizing and tracking your project tasks
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
