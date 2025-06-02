"use client";
import { updateSprintStatus } from "@/actions/sprint";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";

import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";

import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const SprintManager = ({ sprint, setSprint, sprints }: any) => {
  const [status, setStatus] = useState(sprint?.status);
  // const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = new Date(sprint?.startDate);
  const endDate = new Date(sprint?.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) || (isAfter(now, startDate) && status === "PLANNED");

  const canEnd = status === "ACTIVE";

  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints.find((s: any) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint?.status);
  };

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)} ago`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  }: any = useFetch(updateSprintStatus);

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus(sprint.id, newStatus);
    window.location.reload();
  };

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s: any) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }
  }, [searchParams, sprints]);

  useEffect(() => {
    if (updatedStatus && updateStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-4">
        <Select value={sprint?.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-gray-300 w-full md:w-[80%] p-4">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint: any) => {
              return (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")} to{" "}
                  {format(sprint.endDate, "MMM d, yyyy")})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {canStart && status !== "ACTIVE" && (
          <Button
            className="bg-green-900 text-white w-full md:w-auto"
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && status === "ACTIVE" && (
          <Button
            variant="destructive"
            className="bg-red-600 text-white w-full md:w-auto"
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}
      {getStatusText() && (
        <div className="mt-3">
          <p className="bg-yellow-500 p-2 rounded-lg w-full md:w-[20%] text-center mx-auto text-black">
            {getStatusText()}
          </p>
        </div>
      )}
    </>
  );
};

export default SprintManager;
