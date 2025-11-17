import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

interface EntitySearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function EntitySearch({
  value = '',
  onChange,
  placeholder = 'Search...',
  isLoading = false,
  autoFocus = false,
  className,
}: EntitySearchProps) {
  return (
    <div className={cn('relative flex h-full w-full max-w-xs items-center', className)}>
      <SearchIcon
        className={cn(
          'text-muted-foreground absolute left-3 size-4 transition-opacity',
          isLoading && 'animate-pulse opacity-50'
        )}
      />

      <Input
        value={value}
        type="search"
        placeholder={placeholder}
        className={cn(
          'bg-background border-border pl-9 shadow-none focus-visible:ring-1',
          'focus-visible:ring-primary transition-colors'
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
