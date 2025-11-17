import { cn } from '@/lib/utils';

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export const EntityList = <T,>(props: EntityListProps<T>) => {
  const { getKey, items, renderItem, className, emptyView } = props;

  if (items.length === 0 && emptyView) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-sm">{emptyView}</div>
      </div>
    );
  }
  return (
    <div className={cn('flex flex-col gap-y-4', className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
};

// Alias for backward compatibility
export const WorkflowList = EntityList;
