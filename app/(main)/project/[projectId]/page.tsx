import { getProject } from "@/actions/project";
import { notFound } from "next/navigation";
import React from "react";
import SprintCreationForm from "../_components/SprintCreationForm";
import SprintBoard from "../_components/SprintBoard";

const ProjectPage = async ({ params }: any) => {
  const { projectId } = await params;

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="ml-50  relative top-20">
      <SprintCreationForm
        projectTitle={project[0].name}
        projectId={project[0].id}
        projectKey={project[0].key}
        sprintKey={(project[0].sprints?.length || 0) + 1}
      />
      {project[0].sprints?.length > 0 ? (
        <div className="mt-10 ">
          <SprintBoard
            sprints={project[0]?.sprints}
            projectId={projectId}
            orgId={project[0]?.organizationId}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500  text-2xl text-bold">
          Create a Sprint from button above
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
