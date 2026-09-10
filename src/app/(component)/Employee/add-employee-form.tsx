/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/authActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Lock, User, UserPlus, } from "lucide-react";
import { User as UserType , UserSchema } from "@/types/type";
import { z } from "zod";
import { useUserStore } from "@/app/store/useUserStore";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
const AddEmployeeForm: React.FC<{businessId:string }> = ({businessId}) => {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });
const { data: session, status, update } = useSession();
  useEffect(() => {
    if (status === 'loading' || !session) {
      update();
    }
  }, [session, status, update]);
  const user = session?.user as UserType;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    form.reset();
  };
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof UserSchema>) {
  
    const result = await registerUser(user.business_Id as string,values);

    if (typeof result === "string") {
      toast.error(result);
      return;
    }
    if (result.status === "success") {
      toast.success("Employees successfully added");
      router.refresh();
      handleDialogClose()
    } else {
      form.setError("root.serverError", { message: result.error as string });
      toast.error(`${result.error}`);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="m-2" onClick={() => setIsDialogOpen(true)}>
          <UserPlus /> Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Create employee profile here. Click submit when youre done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                      className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                    Role
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Add Employee
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeForm;
