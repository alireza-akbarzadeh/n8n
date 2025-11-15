import { PackageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";

interface EmptyViewProps {
  onNew?: () => void;
  message?: string;
}

export const EmptyView = (props: EmptyViewProps) => {
  const { message, onNew } = props;
  return (
    <Empty className="border border-dashed bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No items</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && <Button onClick={onNew}>Add Item</Button>}
    </Empty>
  );
};
