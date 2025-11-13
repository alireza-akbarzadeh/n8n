import UpgradeModal from "@/components/upgrade-modal";
import { TRPCClientError } from "@trpc/client";
import { err } from "inngest/types";
import * as React from "react";

export function useUpgradeModal() {
  const [open, setOpen] = React.useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return { handleError, modal };
}
