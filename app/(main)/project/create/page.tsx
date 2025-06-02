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
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
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

  console.log("Project", project)
  const onSubmit = async (data: any) => {
    createProjectFn(data);
  };

  useEffect(() => {
    if (project) {
      toast.success("Project created successfully !!");
      router.push(`/project/${project?.id}`);
    }
  }, [loading]);

  if (!isOrgLoaded || !isUserLoaded) {
    return <div>Loading...</div>;
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
      <h1 className="text-3xl md:text-6xl text-center font-bold mb-8 gradient-title mt-16">
        Create New Project
      </h1>
      <form
        className="flex flex-col space-y-4 max-w-4xl bg-gray-400 p-6 md:p-8 mx-auto rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Input
            id="name"
            className="bg-white py-4 md:py-8 text-center text-black"
            placeholder="Project Name"
            {...register("name")}
          />
          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.root?.message}</p>
          )}
        </div>
        <div>
          <Input
            id="key"
            className="bg-white py-4 md:py-8 text-center text-black uppercase"
            placeholder="Project Key (Ex: RCYT)"
            {...register("key")}
          />
        </div>
        {errors?.key && (
          <p className="text-red-500 text-sm mt-1">{errors?.root?.message}</p>
        )}
        <div>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-white py-4 md:py-8 h-20 md:h-28 text-center text-black"
            placeholder="Project Description"
          />
          {errors?.description && (
            <p className="text-red-500 text-sm mt-1">{errors.root?.message}</p>
          )}
        </div>
        {loading && (
          <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        )}
        <Button
          type="submit"
          size="lg"
          className="bg-green-700 text-white w-full md:w-[20em] self-center"
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>
        {error && <p className="text-red-500 mt-2">{errors?.root?.message}</p>}
      </form>
    </div>
  );
};

export default CreateProjectPage;
