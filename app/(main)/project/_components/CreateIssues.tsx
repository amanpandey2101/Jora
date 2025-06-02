"use client";

import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import useFetch from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issue";
import { getOrganizationUsers } from "@/actions/organization";
import { issueSchema } from "@/lib/validators";
import { toast } from "sonner";

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}: any) {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    // error: createIssueError,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users = [],
  } = useFetch(getOrganizationUsers);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
      title: "",
    },
  });

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
  }, [isOpen, orgId]);

  const onSubmit = async (data: any) => {
    try {
      await createIssueFn(projectId, {
        ...data,
        status,
        sprintId,
      });
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
      toast.success("Issue created successfully !!");
    }
  }, [newIssue, createIssueLoading]);

  return (
    <Drawer open={isOpen} onClose={onClose}>
  <DrawerContent className=" sm:px-28 ">
    <DrawerHeader>
      <DrawerTitle className="text-center text-xl sm:text-2xl font-bold uppercase">
        Create New Issue
      </DrawerTitle>
    </DrawerHeader>

    {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}

    <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6 max-w-full">
      {/* Title Input */}
      <div>
        <Input
          id="title"
          {...register("title")}
          className="w-full"
          placeholder="Enter Title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-2">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Assignee Selector */}
      <div>
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.assigneeId && (
          <p className="text-red-500 text-sm mt-2">
            {errors.assigneeId.message}
          </p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <MDEditor
              className="w-full rounded border p-2"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Priority Selector */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-2">
          Priority
        </label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={createIssueLoading}
          className="w-full sm:w-40 text-center"
        >
          {createIssueLoading ? "Creating..." : "Create Issue"}
        </Button>
      </div>
    </form>
  </DrawerContent>
</Drawer>

  );
}
