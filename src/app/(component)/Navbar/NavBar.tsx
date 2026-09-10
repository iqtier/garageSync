/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from "next/link";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { SideBarToggle } from "./SidebarToggle";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./ThemeToggleButton";
import { UserMenu } from "./UserMenu";


export default async function Component() {
  const session = await auth();
  return (
    <nav className="sticky inset-x-0 top-0 bg-stone-50 dark:bg-slate-800  shadow-lg z-10 pr-5">
      <div className="flex justify-between h-14 items-center  py-5">
        <div className="flex  h-14 items-center">
          <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SideBarToggle />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </div>
         
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {session?.user ? (
            <div className="flex items-center gap-4">
              <UserMenu />
               <p className="text-gray-900 dark:text-gray-400">{session?.user?.name}</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "outline" })}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={`${buttonVariants({ variant: "default" })} `}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}