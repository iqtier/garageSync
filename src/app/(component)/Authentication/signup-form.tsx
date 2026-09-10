"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, } from "lucide-react";
import { registerUser } from "@/app/actions/authActions";
import { UserSchema } from "@/types/type";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    startTransition(async () => {
      const result = await registerUser(null, values);
      if (typeof result === "string") {
        toast.error(result);
        return;
      }
      if (result.status === "success") {
        toast.success("User registration successful");
        router.push("/sign-in");
      } else {
        form.setError("root.serverError", { message: result.error as string });
        toast.error(`${result.error}`);
      }
    });
  }

  return (
    <Card className="mx-auto  shadow-2xl dark:bg-gray-800 dark:border-gray-700 dark:ring-offset-slate-900 animate-in fade-in slide-in-from-bottom-10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Register
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Enter your information to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button
              type="submit"
              disabled={isPending}
              className="w-full relative"
            >
              {isPending ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>

        <div className=" text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="underline text-blue-500 dark:text-blue-400"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
