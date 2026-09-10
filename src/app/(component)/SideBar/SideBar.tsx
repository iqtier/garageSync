"use client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {

  CalendarCheck,
  UserCog,
  User,
  ShoppingBasket,
  Wrench,
 
  Settings2,
  BarChart,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useUserStore } from "@/app/store/useUserStore";

const items = [
  {
    title: "Dashboard",
    url: "/home/dashboard",
    icon: BarChart ,
    className:"text-green-500 "
  },
  {
    title: "Bookings",
    url: "/home/bookings",
    icon: CalendarCheck,
    className:"text-blue-500 "
  },
  {
    title: "Employees",
    url: "/home/employees",
    icon: UserCog,
    className:"text-purple-500"
  },
  {
    title: "Clients",
    url: "/home/clients",
    icon: User,
    className:"text-orange-600"
  },
  {
    title: "Inventory",
    url: "/home/inventory",
    icon: ShoppingBasket,
    className:"text-red-500"
  },
  {
    title: "Services",
    url: "/home/services",
    icon: Wrench,
    className:"text-teal-600"
  },

  {
    title: "Settings",
    url: "/home/settings",
    icon: Settings2,
    className:"text-cyan-500"
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}
export function AppSidebar({ ...props }: AppSidebarProps) {
  const { business } = useUserStore();
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-stone-50 dark:bg-slate-900  border-r dark:border-gray-700 shadow-md z-20"
    >
      <SidebarHeader>
        <BrandLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "group transition-colors duration-200 hover:bg-green-200 dark:hover:bg-green-700",
                      pathname === item.url
                        ? "bg-green-200 dark:bg-green-700 text-gray-800 dark:text-white "
                        : "text-gray-500 "
                    )}
                    asChild
                  >
                    <a href={item.url} className="flex items-center gap-2">
                   <item.icon className= {item.className}/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
