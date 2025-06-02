
// components/ProjectList.jsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/project";
import DeleteProject from "./DeleteProject";



export default async function ProjectList({ orgId}:any) {
  const projects = await getProjects(orgId);

  if (projects.length === 0) {
    return (
      <p>
        No projects found.{" "}
        <Link
          className="underline underline-offset-2 text-blue-600"
          href="/project/create"
        >
          Create New.
        </Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {projects.map((project: any) => (
      <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-xl font-semibold text-gray-800 p-4 border-b border-gray-200">
              {project.name}
               <DeleteProject projectId={project.id} /> 
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <Link
              href={`/project/${project.id}`}
              className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
  
  );
}
