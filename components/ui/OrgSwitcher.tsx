"use client";

import { usePathname } from "next/navigation";
import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";

const OrgSwitcher = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  if (!isLoaded || !isUserLoaded) {
    return null;
  }

  return (
    <div className="flex justify-end mt-1">
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal
          createOrganizationMode="modal"
          afterCreateOrganizationUrl="/organization/:id"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: "flex justify-center items-center",
              organizationSwitcherTrigger:
                "glass border-0 px-5 py-2 hover:bg-white/10 dark:hover:bg-white/10 transition-all",
              organizationSwitcherTriggerIcon: "text-foreground",
              organizationPreview: "text-foreground",
              organizationPreviewMainIdentifier: "text-foreground font-bold",
              organizationPreviewSecondaryIdentifier: "text-muted-foreground",
              avatarBox: "size-10",
              // Modal/Popover styling
              card: "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl",
              modalContent: "bg-transparent", // card handles bg
              modalCloseButton: "text-foreground hover:text-primary",
              // Form elements
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-transparent border border-input text-foreground",
              identityPreview: "text-foreground",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80",
              organizationSwitcherPopoverCard: "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl",
              organizationSwitcherPopoverActions: "text-foreground",
              organizationSwitcherPopoverActionButton: "text-foreground hover:bg-black/5 dark:hover:bg-white/10",
              organizationSwitcherPopoverActionButtonText: "text-foreground",
              organizationSwitcherPopoverActionButtonIcon: "text-foreground",
            },
            variables: {
              colorPrimary: "#7c3aed",
              colorInputBackground: "transparent",
              colorInputText: "inherit",
            }
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;