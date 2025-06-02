"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/ui/UserAvatar";
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./IssueDetailsDialog";

const priorityColor: any = {
  LOW: "border-green-500 text-green-500",
  MEDIUM: "border-yellow-500 text-yellow-500",
  HIGH: "border-orange-500 text-orange-500",
  URGENT: "border-red-500 text-red-500",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  const router = useRouter();

  const onDeleteHandler = (...params: any) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params: any) => {
    router.refresh();
    onUpdate(...params);
  };
  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={`border-t-4 ${
            priorityColor[issue.priority]
          } rounded-lg p-4`}
        >
          <CardTitle className="text-lg font-semibold">{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
}
