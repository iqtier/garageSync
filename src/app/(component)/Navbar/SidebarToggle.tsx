"use client"

import { useSidebar } from "@/components/ui/sidebar"
 import {PanelLeft} from 'lucide-react'
import { Button } from "@/components/ui/button";
import React from "react";
export function SideBarToggle() {
  const { toggleSidebar } = useSidebar()
 
  return (
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <PanelLeft className="h-4 w-4"/>
       </Button>
  )
}