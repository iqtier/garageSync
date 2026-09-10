/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { Eye, PenLine, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { deleteEmployee } from "@/app/actions/employeeActions";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Employee, User } from "@/types/type";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
 
  {
    accessorKey: "role",
    header: () => <div className="text-right">Role</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("role")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const id = row.original.id
      const email = row.getValue("email");
      const { data: session } = useSession()
      const user = session?.user as User;
      const isUserAdmin = user?.role === "admin";
      const handleDelete = async () => {
        if(session?.user?.email === email ) {
          toast.error("You cannot delete your own account.");
          return;
        }
        try {
          const result = await deleteEmployee(email as string); // Ensure this function exists and works as expected
          if (result.status === "success") {
            toast.success("Employee deleted successfully");
            router.refresh(); // Refresh the page or handle the update to reflect changes
          } else {
            toast.error("Failed to delete employee");
          }
        } catch (error) {
          toast.error("An error occurred while deleting the employee");
        }
      };
      return (
        <div className="flex gap-2 items-center justify-center ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/home/${id}`}>
                <Eye/>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <PenLine />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild disabled={!isUserAdmin}> 
                    <Button disabled={!isUserAdmin} variant={"ghost"} size="icon">
                      <Trash2 color="red " />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-red-700">
                  <p className="font-bold">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  Employee account and remove data from database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel  >Cancel</AlertDialogCancel>
                <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}  onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
