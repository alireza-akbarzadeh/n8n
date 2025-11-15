import { ReactNode } from "react";

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
