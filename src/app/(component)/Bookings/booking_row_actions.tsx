"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, SquarePen, Trash2, SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import EditBookingForm from "./edit_booking_form";
import Link from "next/link";

interface DataTableRowActionsProps {
  booking_id: string;
}

export const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
  booking_id,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white animate-in fade-in slide-in-from-bottom-10">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Edit</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Edit Booking
            </DialogDescription>
          </DialogHeader>
          <EditBookingForm booking_id={booking_id} setIsOpen={setIsEditOpen} />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button  className="h-8 w-8 relative group rounded-full bg-green-500 ">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white animate-in fade-in slide-in-from-bottom-10">
           <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-gray-900 dark:text-gray-400 ">
              <button
                onClick={() => {
                  setIsEditOpen(true);
                }}
                className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div
                  className={cn(
                    "flex flex-row text-center items-center justify-center space-x-2"
                  )}
                >
                  <SquarePen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm  text-gray-900 dark:text-gray-400">Edit</span>
                </div>
              </button>
            </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-gray-900 dark:text-gray-400 ">
            <Link
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
              href={`/home/bookings/${booking_id}`}
            >
              <div
                className={cn(
                  "flex flex-row text-center items-center justify-center space-x-2"
                )}
              >
                <SquareArrowOutUpRight className="h-4 w-4 text-gray-600 dark:text-gray-400"/>
                <span className="text-sm  text-gray-900 dark:text-gray-400">Details</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-gray-900 dark:text-gray-400 ">
              <button
                onClick={() => {
                  setIsDeleteOpen(true);
                }}
                className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div
                  className={cn(
                    "flex flex-row text-center items-center justify-center space-x-2"
                  )}
                >
                  <Trash2 className="h-4 w-4  text-red-500 "/>
                  <span className="text-sm">Delete</span>
                </div>
              </button>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};