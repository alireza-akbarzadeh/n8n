import { requireAuth } from "@/actions/auth";
import React from "react";

export default async function Executions() {
  await requireAuth();
  return <div>executions</div>;
}
