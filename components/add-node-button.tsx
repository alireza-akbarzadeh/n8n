import * as React from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { NodeSelector } from "./node-selector";

export const AddNodeButton = React.memo(function AddNodeButton() {
  const [selectorOpen, setSelectorOpen] = React.useState<boolean>(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button size="icon" variant="outline" className="bg-background">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
