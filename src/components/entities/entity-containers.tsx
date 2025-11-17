import { ReactNode } from 'react';

type EntityContainerProps = {
  children: ReactNode;
  header?: ReactNode;
  search?: ReactNode;
  pagination?: ReactNode;
  hasPaginate?: boolean;
};

export function EntityContainer(props: EntityContainerProps) {
  return (
    <div className="h-full p-4 md:px-10 md:py-6">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-y-8">
        {props.header}
        {props.search}
        <div className="flex h-full flex-1 flex-col gap-y-4">{props.children}</div>
        {props.hasPaginate && props.pagination}
      </div>
    </div>
  );
}
