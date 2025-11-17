import { Button } from '@/src/shared/ui/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/src/shared/ui/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/ui/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreVerticalIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

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
          'cursor-pointer p-4 shadow-neutral-50 hover:shadow',
          isRemoving && 'cursor-not-allowed opacity-50',
          className
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
            <div className="flex items-center gap-x-4">
              {actions}

              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(event) => event.stopPropagation()}
                    >
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
