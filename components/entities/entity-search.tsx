import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

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
