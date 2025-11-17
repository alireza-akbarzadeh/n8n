import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/shared/ui/components/ui/pagination';

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
    const range: (number | '...')[] = [];

    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }

    if (typeof range[0] === 'number' && range[0] > 2) range.unshift('...');
    if (range[0] !== 1) range.unshift(1);

    if (
      typeof range[range.length - 1] === 'number' &&
      Number(range[range.length - 1]) < totalPages - 1
    ) {
      range.push('...');
    }
    if (range[range.length - 1] !== totalPages) range.push(totalPages);

    return range;
  };
  const pages = getPages();

  const handlePageClick = (p: number | string) => {
    if (typeof p === 'number' && !disabled && p !== page) {
      onPageChange(p);
    }
  };

  return (
    <div
      className={cn('flex w-full flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-center', className)}
    >
      {showPageInfo && (
        <div className="text-muted-foreground flex gap-3 text-sm">
          Page <span className="font-medium">{page}</span> of{' '}
          <span className="font-medium">{totalPages || 1}</span>
        </div>
      )}
      <Pagination className="justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={page === 1 || disabled}
              onClick={() => handlePageClick(Math.max(1, page - 1))}
              className={cn(page === 1 || disabled ? 'pointer-events-none opacity-50' : '')}
            />
          </PaginationItem>

          {pages.map((p, idx) =>
            p === '...' ? (
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
                      'cursor-pointer',
                      p === page && 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )
          )}

          <PaginationItem>
            <PaginationNext
              aria-disabled={page === totalPages || disabled || totalPages === 0}
              onClick={() => handlePageClick(Math.min(totalPages, page + 1))}
              className={cn(
                page === totalPages || totalPages === 0 || disabled
                  ? 'pointer-events-none opacity-50'
                  : ''
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
