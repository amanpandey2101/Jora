"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";

import { sprintSchema } from "@/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprint";
import { toast } from "sonner";

export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date() || undefined,
    to: addDays(new Date(), 14) || undefined,
  });
  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const onSubmit = async (data: any) => {
    await createSprintFn(projectId, {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
    setShowForm(false);
    toast.success("Sprint created successfully");
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mx-5 md:mx-20 pt-6 md:pt-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-8 gradient-title uppercase">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4 mx-4 md:mx-10">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 md:flex-row items-start md:items-end"
            >
              <div className="flex-1 w-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-gray-300 w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
  control={control}
  name="startDate"
  render={({ field }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal bg-gray-300 ${
            !dateRange.from && "text-muted-foreground"
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from && dateRange.to ? (
            format(dateRange.from, "LLL dd, y") +
            " - " +
            format(dateRange.to, "LLL dd, y")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full bg-gray-300 p-5" align="start">
        <DayPicker
          classNames={{
            chevron: "fill-gray-500",
            range_start: "bg-gray-700",
            range_end: "bg-gray-700",
            range_middle: "bg-gray-400",
            day_button: "border-none",
            today: "border-2 border-gray-700",
          }}
          mode="range"
          disabled={[{ before: new Date() }]}
          selected={dateRange}
          onSelect={(range: any) => {
            if (range?.from && range?.to) {
              setDateRange(range);
              field.onChange(range.from); // Assign start date to the field
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )}
/>

              </div>
              <Button
                type="submit"
                disabled={createSprintLoading}
                className="w-full md:w-auto"
              >
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
