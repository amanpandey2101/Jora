import { Suspense } from "react";
import { getUserIssues } from "@/actions/organization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import IssueCard from "../../../project/_components/IssueCard";

export default async function UserIssues({ userId, orgId }: { userId: string; orgId: string }) {
  try {
    const issues = await getUserIssues(userId, orgId);

    if (issues.length === 0) {
      return (
        <div className="mx-10">
          <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>
          <Card className="card-enhanced">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Issues Found</h3>
              <p className="text-gray-600">
                You don&apos;t have any issues assigned or reported yet. Start by creating some tasks in your projects!
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const assignedIssues = issues.filter(
      (issue: any) => issue.assignee?.clerkUserId === userId
    );
    const reportedIssues = issues.filter(
      (issue: any) => issue.reporter?.clerkUserId === userId
    );

    return (
      <div className="mx-10">
        <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>

        <Tabs defaultValue="assigned" className="w-full">
          <TabsList>
            <TabsTrigger value="assigned">
              Assigned to You ({assignedIssues.length})
            </TabsTrigger>
            <TabsTrigger value="reported">
              Reported by You ({reportedIssues.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assigned">
            <Suspense fallback={<LoadingSkeleton />}>
              <IssueGrid issues={assignedIssues} />
            </Suspense>
          </TabsContent>
          <TabsContent value="reported">
            <Suspense fallback={<LoadingSkeleton />}>
              <IssueGrid issues={reportedIssues} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error loading user issues:", error);
    return (
      <div className="mx-10">
        <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>
        <Card className="card-enhanced border-red-200">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Failed to Load Issues</h3>
            <p className="text-gray-600">
              There was an error loading your issues. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function IssueGrid({ issues }: { issues: any[] }) {
  if (issues.length === 0) {
    return (
      <Card className="card-enhanced">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">🗂️</div>
          <p className="text-gray-600">No issues in this category yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue: any) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="card-enhanced animate-pulse">
          <CardContent className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
