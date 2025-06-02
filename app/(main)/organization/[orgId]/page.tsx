import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/ui/OrgSwitcher";
import React from "react";
import ProjectList from "./_components/ProjectList";
import UserIssues from "./_components/UserIssues";
import { auth } from "@clerk/nextjs/server";

const Organization = async ({ params }: any) => {
  const { orgId } = await params;
  const organization = await getOrganization(orgId);
  const {userId} = await auth();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-28">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2 uppercase">
          {organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitcher />
      </div>
      <div className="mb-4">
        <ProjectList orgId={organization.id}/>
      </div>
      <div className="mb-4">
        <UserIssues userId={userId}/>
      </div>
    </div>
  );
};

export default Organization;
