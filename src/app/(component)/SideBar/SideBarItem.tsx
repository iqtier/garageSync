"use client"

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import React from "react";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
const SideBarItem = ({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon:  React.JSX.Element;
  };
}) => {
    const pathname = usePathname()
    const active = pathname ===item.url
  return (
    <SidebarMenuItem  key={item.title}>
      <SidebarMenuButton tooltip={item.title} className={cn("group transition-colors duration-200 hover:bg-green-200 dark:hover:bg-green-700",
        active? "bg-green-200 dark:bg-green-700 text-gray-800 dark:text-white " : "text-gray-500 ")} asChild>
        <a href={item.url} className="flex items-center gap-2">
          {item.icon}
            <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SideBarItem;