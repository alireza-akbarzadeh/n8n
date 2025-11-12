import { requireAuth } from "@/actions/auth";
import React from "react";

export default async function Credentials() {
  await requireAuth();
  return <div>WorkflowPage</div>;
}
