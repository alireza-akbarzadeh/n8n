import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@radix-ui/react-navigation-menu";
import { ReactNode } from "react";

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

type EntityContainerProps = {
  children: ReactNode;
  header?: ReactNode;
  search?: ReactNode;
  pagination?: ReactNode;
};

export function EntityContainer(props: EntityContainerProps) {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        {props.header}
        <div className="flex flex-col gap-y-4 h-full">
          {props.search}
          {props.children}
        </div>
        {props.pagination}
      </div>
    </div>
  );
}
