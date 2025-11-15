import { cn } from "@/lib/utils";

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
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
};
