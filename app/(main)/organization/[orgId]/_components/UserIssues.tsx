
import { Suspense } from "react";
import { getUserIssues } from "@/actions/organization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "../../../project/_components/IssueCard";

export default async function UserIssues({ userId }:any) {
  const issues = await getUserIssues(userId);

  if (issues.length === 0) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue:any) => issue.assignee.clerkUserId === userId
  );
  const reportedIssues = issues.filter(
    (issue:any) => issue.reporter.clerkUserId === userId
  );

  return (
    <div className="mx-10">
      <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
          <TabsTrigger value="reported">Reported by You</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>
        <TabsContent value="reported">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IssueGrid({ issues}:any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue:any) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}
