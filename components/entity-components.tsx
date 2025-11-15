import { AlertTriangle, MoreVerticalIcon, PackageIcon, PlusIcon, SearchIcon, TrashIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ReactNode } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination";
import { Spinner } from "./ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

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
  hasPaginate?: boolean;
};

export function EntityContainer(props: EntityContainerProps) {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        {props.header}
        {props.search}
        <div className="flex h-full flex-1 flex-col gap-y-4 ">{props.children}</div>
        {props.hasPaginate && props.pagination}
      </div>
    </div>
  );
}

interface EntitySearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function EntitySearch({
  value = "",
  onChange,
  placeholder = "Search...",
  isLoading = false,
  autoFocus = false,
  className,
}: EntitySearchProps) {
  return (
    <div className={cn("relative flex items-center w-full h-full max-w-xs", className)}>
      <SearchIcon
        className={cn(
          "absolute left-3 size-4 text-muted-foreground transition-opacity",
          isLoading && "opacity-50 animate-pulse",
        )}
      />

      <Input
        value={value}
        type="search"
        placeholder={placeholder}
        className={cn(
          "pl-9  bg-background border-border shadow-none focus-visible:ring-1",
          "focus-visible:ring-primary transition-colors",
        )}
        aria-label={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        autoFocus={autoFocus}
      />
    </div>
  );
}

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  showPageInfo?: boolean;
}

export function EntityPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  className,
  showPageInfo = true,
}: EntityPaginationProps) {
  const getPages = () => {
    const delta = 2;
    const range: (number | "...")[] = [];

    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }

    if (typeof range[0] === "number" && range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);

    if (typeof range[range.length - 1] === "number" && Number(range[range.length - 1]) < totalPages - 1) {
      range.push("...");
    }
    if (range[range.length - 1] !== totalPages) range.push(totalPages);

    return range;
  };
  const pages = getPages();

  const handlePageClick = (p: number | string) => {
    if (typeof p === "number" && !disabled && p !== page) {
      onPageChange(p);
    }
  };

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center  gap-y-2 gap-x-4 w-full", className)}>
      {showPageInfo && (
        <div className="flex gap-3 text-sm text-muted-foreground">
          Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages || 1}</span>
        </div>
      )}
      <Pagination className="justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={page === 1 || disabled}
              onClick={() => handlePageClick(Math.max(1, page - 1))}
              className={cn(page === 1 || disabled ? "opacity-50 pointer-events-none" : "")}
            />
          </PaginationItem>

          {pages.map((p, idx) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              p > 0 && (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageClick(p);
                    }}
                    isActive={p === page}
                    className={cn(
                      "cursor-pointer",
                      p === page && "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            ),
          )}

          <PaginationItem>
            <PaginationNext
              aria-disabled={page === totalPages || disabled || totalPages === 0}
              onClick={() => handlePageClick(Math.min(totalPages, page + 1))}
              className={cn(
                page === totalPages || totalPages === 0 || disabled ? "opacity-50 pointer-events-none" : "",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface StateViewProps {
  message?: string;
}

interface LoadingViewProps extends StateViewProps {
  entity?: string;
}

export const LoadingView = (props: LoadingViewProps) => {
  const { entity, message } = props;

  return (
    <div className="flex-1 flex justify-center items-center h-full flex-col gap-y-4">
      <Spinner />
      {!!message && <p className="text-sm text-muted-foreground">{message || `Loading ${entity}...`}</p>}
    </div>
  );
};

interface ErrorViewProps {
  message?: string;
}

export const ErrorView = (props: ErrorViewProps) => {
  const { message } = props;

  return (
    <div className="flex-1 flex justify-center items-center h-full flex-col gap-y-4">
      <AlertTriangle className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
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

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EnityItem = (props: EntityItemProps) => {
  const { href, title, actions, className, image, isRemoving, onRemove, subtitle } = props;

  const handleRemove = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRemoving) return;
    if (onRemove) await onRemove();
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-neutral-50 hover:shadow cursor-pointer",
          isRemoving && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">{image}</div>
            <div className="space-y-2">
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
              {!!subtitle && <CardDescription className="text-sm">{subtitle}</CardDescription>}
            </div>
          </div>

          {(actions || onRemove) && (
            <div className="flex gap-x-4 items-center">
              {actions}

              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={(event) => event.stopPropagation()}>
                      <MoreVerticalIcon className="scale-z-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                    <DropdownMenuItem onClick={handleRemove}>
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
};
