"use client";

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MDEditor from "@uiw/react-md-editor";
import useFetch from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issue";
import { getOrganizationUsers } from "@/actions/organization";
import { issueSchema } from "@/lib/validators";
import { toast } from "sonner";
import { 
  Sparkles, 
  Wand2, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  User,
  FileText,
  Flag
} from "lucide-react";

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
  projectName,
  projectDescription,
}: any) {
  const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
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
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
      title: "",
    },
  });

  const watchedTitle = watch("title");

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const generateAiDescription = async () => {
    if (!watchedTitle || !projectDescription) {
      toast.error('Please enter a task title first');
      return;
    }

    setAiDescriptionLoading(true);
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle: watchedTitle,
          projectContext: `${projectName}: ${projectDescription}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      setValue('description', data.description);
      setShowAiSuggestion(true);
      toast.success('AI description generated successfully!');
    } catch (error) {
      console.error('Error generating AI description:', error);
      toast.error('Failed to generate AI description');
    } finally {
      setAiDescriptionLoading(false);
    }
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
      toast.success("Issue created successfully !!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newIssue, createIssueLoading]);

  const priorityColors = {
    LOW: "bg-green-100 text-green-800 border-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
    HIGH: "bg-orange-100 text-orange-800 border-orange-300",
    URGENT: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="sm:px-28 max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DrawerTitle className="text-center text-xl sm:text-2xl font-bold gradient-title">
              Create New Issue
            </DrawerTitle>
            <p className="text-center text-gray-600 mt-2">
              Build better products with AI-powered task creation
            </p>
          </motion.div>
        </DrawerHeader>

        {usersLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4"
          >
            <BarLoader width={"100%"} color="#36d7b7" />
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6 max-w-full">
          {/* Title Input with Icon */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 mr-2" />
              Issue Title
            </label>
            <Input
              id="title"
              {...register("title")}
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a descriptive title for your issue"
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-2 flex items-center"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.title.message}
              </motion.p>
            )}
          </motion.div>

          {/* AI Description Generation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 mr-2" />
                Description
              </label>
              <Button
                type="button"
                onClick={generateAiDescription}
                disabled={aiDescriptionLoading || !watchedTitle}
                size="sm"
                className="ai-button text-xs"
              >
                {aiDescriptionLoading ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Wand2 className="h-3 w-3 mr-1" />
                )}
                {aiDescriptionLoading ? 'Generating...' : 'AI Generate'}
              </Button>
            </div>

            <AnimatePresence>
              {showAiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-2"
                >
                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-3">
                      <div className="flex items-center text-sm text-purple-700">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI-generated description has been added below
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="card-enhanced">
                  <MDEditor
                    className="w-full rounded border-0"
                    value={field.value}
                    onChange={field.onChange}
                    preview="edit"
                    hideToolbar={false}
                    data-color-mode="light"
                  />
                </div>
              )}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User className="h-4 w-4 mr-2" />
                Assignee
              </label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="smooth-hover">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user: any) => (
                        <SelectItem key={user.id} value={user.id} className="hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            {user.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assigneeId && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-2 flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.assigneeId.message}
                </motion.p>
              )}
            </motion.div>

            {/* Priority Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Flag className="h-4 w-4 mr-2" />
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
                    <SelectTrigger className="smooth-hover">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityColors).map(([priority, colorClass]) => (
                        <SelectItem key={priority} value={priority} className="hover:bg-gray-50">
                          <div className="flex items-center">
                            <Badge className={`${colorClass} text-xs mr-2`}>
                              {priority}
                            </Badge>
                            {priority.charAt(0) + priority.slice(1).toLowerCase()}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center pt-4"
          >
            <Button
              type="submit"
              disabled={createIssueLoading}
              className="w-full sm:w-48 btn-primary relative"
            >
              {createIssueLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Issue...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Issue
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
