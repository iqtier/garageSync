"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

import { Cog } from "lucide-react";
import { motion } from "framer-motion";


export function BrandLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-10  items-center justify-start ">
          <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className=" rounded-full"
            >
              <Cog className="size-8" color="green" />
            </motion.div>
          </div>

          <Link href="/home" prefetch={false}>
            <div className="flex items-center gap-2 font-bold text-3xl text-green-700">
              GarageSync
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
