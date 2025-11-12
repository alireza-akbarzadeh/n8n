"use client";

import { CreditCardIcon, FolderOpenIcon, HistoryIcon, HomeIcon, KeyIcon, LogOutIcon, StarIcon } from "lucide-react";
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
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/auth";
import { authClient } from "@/lib/auth-client";
import { SignOutButton } from "@/modules/auth/ui/sign-out-button";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (url: string) => {
    return url === "/" ? pathname === "/" : pathname.startsWith(url);
  };
  const menuItems = [
    {
      title: "Workflows",
      items: [
        {
          title: "Workflows",
          path: "/workflows",
          icon: FolderOpenIcon,
        },
        {
          title: "Credintials",
          path: "/credentials",
          icon: KeyIcon,
        },
        {
          title: "Executions",
          path: "/executions",
          icon: HistoryIcon,
        },
      ],
    },
    {
      title: "History",
      items: [
        {
          title: "History",
          path: "/history",
          icon: HistoryIcon,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton className="gap-x-4 h-10 px-4" tooltip="Workflows" asChild>
            <Link prefetch href="/">
              <Image src="/images/logo.svg" alt="Logo" width={30} height={30} />
              <span className="font-semibold text-sm">Nodebase</span>
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
                    className="gap-x-4 h-10 px-4"
                    tooltip={item.title}
                    isActive={isActive(item.path)}
                    asChild
                  >
                    <Link prefetch href={item.path}>
                      {item.icon && <item.icon className="size-4 mr-2" />}
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
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {}} className="gap-x-4 h-10 px-4" tooltip="Upgrade to Pro" asChild>
              <div className="flex items-center">
                <StarIcon className="size-4 mr-2" />
                <span>Upgrade to Pro</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {}} className="gap-x-4 h-10 px-4" tooltip="Billing Portal" asChild>
              <div className="flex items-center">
                <CreditCardIcon className="size-4 mr-2" />
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
                      router.push("/login");
                    },
                  },
                });
              }}
              className="gap-x-4 h-10 px-4"
              tooltip="Logout"
              asChild
            >
              <SignOutButton variant="ghost" className="justify-start" icon={<LogOutIcon className="size-4 mr-2" />} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
