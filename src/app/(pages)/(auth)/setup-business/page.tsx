"use client";
import BusinessSetup from "@/app/(component)/Authentication/business-setup-form";

import { ModeToggle } from "@/app/(component)/Navbar/ThemeToggleButton";
import { useUserStore } from "@/app/store/useUserStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const { clearUser } = useUserStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref to the scrollable area
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0); 
  useEffect(() => {
    // Function to calculate the remaining height
    const calculateHeight = () => {
      if (scrollAreaRef.current) {
        const topOffset = scrollAreaRef.current.offsetTop;
        const windowHeight = window.innerHeight;
        const calculatedHeight = windowHeight - topOffset -45; // Subtract some padding
        setScrollAreaHeight(calculatedHeight);
      }
    };

    // Calculate the height after the component mounts and on window resize
    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    // Clean up the event listener
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  async function handleSignOut() {
    clearUser(); // ✅ Clear Zustand user data
    await signOut({ callbackUrl: "/sign-in" }); // ✅ Sign out
  }
  return (
    <div className="  flex flex-col items-center justify-center ">
      <div className="flex absolute top-0 p-2  right-0 flex-row z-10 gap-4 justify-end w-full ">
        <ModeToggle />
        <Button
          className="flex flex-row gap-1 items-center "
          type="submit"
          variant={"destructive"}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-3 px-4 pt-4  rounded-lg  bg-white dark:bg-gray-800 shadow-md ">
        <div>
          <h1 className="text-3xl font-bold text-center">Setup Business</h1>
          <p className="text-center text-gray-500">
            Let's get you started with your business details
          </p>
        </div>
        <div className="w-full mt-4 "
         style={{ height: `${scrollAreaHeight}px` }}
         ref={scrollAreaRef}>
          <ScrollArea className="h-full">
            <BusinessSetup />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default page;
