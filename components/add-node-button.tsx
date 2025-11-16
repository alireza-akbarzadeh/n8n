import * as React from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

type AddNodeButtonProps = {
  onAdd?: () => void;
};

export const AddNodeButton = React.memo(function AddNodeButton({ onAdd }: AddNodeButtonProps) {
  return (
    <Button size="icon" variant="outline" className="bg-background" onClick={onAdd}>
      <PlusIcon className="size-4" />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";
