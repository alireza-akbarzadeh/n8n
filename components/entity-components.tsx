import { PlusIcon, SearchIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@radix-ui/react-navigation-menu";
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
    <div className={cn("relative flex items-center w-full max-w-xs", className)}>
      <SearchIcon
        className={cn(
          "absolute left-3 size-4 text-muted-foreground transition-opacity",
          isLoading && "opacity-50 animate-pulse",
        )}
      />

      <Input
        type="search"
        placeholder={placeholder}
        className={cn(
          "pl-9  bg-background border-border shadow-none focus-visible:ring-1",
          "focus-visible:ring-primary transition-colors",
        )}
        value={value}
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
