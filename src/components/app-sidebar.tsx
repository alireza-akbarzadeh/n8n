'use client';

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { SignOutButton } from '@/modules/auth/ui/sign-out-button';
import { useHasActiveSubscription } from '@/modules/subscription';

const menuItems = [
  {
    title: 'Workflows',
    items: [
      {
        title: 'Workflows',
        path: '/workflows',
        icon: FolderOpenIcon,
      },
      {
        title: 'Credintials',
        path: '/credentials',
        icon: KeyIcon,
      },
      {
        title: 'Executions',
        path: '/executions',
        icon: HistoryIcon,
      },
    ],
  },
  {
    title: 'History',
    items: [
      {
        title: 'History',
        path: '/history',
        icon: HistoryIcon,
      },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (url: string) => {
    return url === '/' ? pathname === '/' : pathname.startsWith(url);
  };
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton className="h-10 gap-x-4 px-4" tooltip="Workflows" asChild>
            <Link prefetch href="/">
              <Image src="/images/logo.svg" alt="Logo" width={30} height={30} />
              <span className="text-sm font-semibold">Nodebase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((menu) => (
          <SidebarGroup key={menu.title}>
            <SidebarGroupContent>
              {menu.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="h-10 gap-x-4 px-4"
                    tooltip={item.title}
                    isActive={isActive(item.path)}
                    asChild
                  >
                    <Link prefetch href={item.path}>
                      {item.icon && <item.icon className="mr-2 size-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => authClient.checkout({ slug: 'pro' })}
                className="h-10 cursor-pointer gap-x-4 px-4"
                tooltip="Upgrade to Pro"
                asChild
              >
                <div className="flex items-center">
                  <StarIcon className="mr-2 size-4" />
                  <span>Upgrade to Pro</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => authClient.customer.portal()}
              className="h-10 cursor-pointer gap-x-4 px-4"
              tooltip="Billing Portal"
              asChild
            >
              <div className="flex items-center">
                <CreditCardIcon className="mr-2 size-4" />
                <span>Billing Portal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push('/login');
                    },
                  },
                });
              }}
              className="h-10 gap-x-4 px-4"
              tooltip="Logout"
              asChild
            >
              <SignOutButton
                variant="ghost"
                className="justify-start"
                icon={<LogOutIcon className="mr-2 size-4" />}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
