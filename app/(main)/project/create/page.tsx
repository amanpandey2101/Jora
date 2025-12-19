"use client";

import OrgSwitcher from "@/components/ui/OrgSwitcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { projectSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { createProject } from "@/actions/project";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

const CreateProjectPage = () => {
  const { isLoaded: isOrgLoaded, membership, organization } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership?.role) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch<Project>(createProject);

  console.log("Project", project);
  
  const onSubmit = async (data: any) => {
    if (!organization?.id) {
      toast.error("No organization selected");
      return;
    }
    
    // Add organization ID to the project data
    const projectData = {
      ...data,
      orgId: organization.id
    };
    
    createProjectFn(projectData);
  };

  useEffect(() => {
    if (project && organization?.id) {
      toast.success("Project created successfully !!");
      // Redirect to organization page to maintain org context
      router.push(`/organization/${organization.id}`);
    }
  }, [loading, project, organization, router]);

  if (!isOrgLoaded || !isUserLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex flex-col gap-2 items-center pt-32 px-4">
        <span className="text-2xl gradient-title text-center">
          Please select an organization to create a project.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center pt-32 px-4">
        <span className="text-2xl gradient-title text-center">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-6xl text-center font-bold mb-8 text-gradient pb-2">
        Create New Project
      </h1>
      
      <div className="text-center mb-6">
        <p className="text-lg text-muted-foreground">
          Creating project for: <span className="font-semibold text-primary">{organization.name}</span>
        </p>
      </div>
      
      <form
        className="flex flex-col space-y-4 max-w-4xl glass-card p-6 md:p-8 mx-auto rounded-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Input
            id="name"
            className="bg-white/5 border-white/10 py-6 text-center text-lg placeholder:text-muted-foreground focus:ring-primary/50"
            placeholder="Project Name"
            {...register("name")}
          />
          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name?.message as string}</p>
          )}
        </div>
        <div>
          <Input
            id="key"
            className="bg-white/5 border-white/10 py-6 text-center text-lg uppercase placeholder:text-muted-foreground focus:ring-primary/50"
            placeholder="Project Key (Ex: RCYT)"
            {...register("key")}
          />
          {errors?.key && (
            <p className="text-red-500 text-sm mt-1">{errors.key?.message as string}</p>
          )}
        </div>
        <div>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-white/5 border-white/10 py-4 h-28 text-center placeholder:text-muted-foreground focus:ring-primary/50"
            placeholder="Project Description"
          />
          {errors?.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description?.message as string}</p>
          )}
        </div>
        {loading && (
          <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        )}
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-[20em] self-center bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
};

export default CreateProjectPage;
