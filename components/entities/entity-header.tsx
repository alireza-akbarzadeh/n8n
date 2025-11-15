import { PlusIcon, Link } from "lucide-react";
import { Button } from "../ui/button";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: () => void; newButtonHref?: never }
);

export function EntityHeader(props: EntityHeaderProps) {
  const { title, onNew, description, disabled, isCreating, newButtonHref, newButtonLabel } = props;

  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
      </div>
      {onNew && !newButtonHref && (
        <Button isLoading={isCreating} disabled={disabled} size="sm" onClick={onNew}>
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button size="sm" asChild>
          <Link href={newButtonHref}></Link>
          {newButtonLabel}  
        </Button>
      )}
    </div>
  );
}
