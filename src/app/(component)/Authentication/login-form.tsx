"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signInUser } from "@/app/actions/authActions";
import { LogInSchema,  } from "@/types/type";

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
import { Mail, Lock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";

export function LoginForm() {
 
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 
  async function onSubmit(values: z.infer<typeof LogInSchema>) {
    startTransition(async () => {
      const result = await signInUser(values);
      console.log(result);
      if (result?.status === "success") {
        
        router.push("/");
      } else {
        toast.error(result?.error as string);
      }
    });
  }
  return (
    <Card className="mx-auto max-w-md shadow-2xl dark:bg-gray-800 dark:border-gray-700 dark:ring-offset-slate-900 animate-in fade-in slide-in-from-bottom-10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Login
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Welcome Back! Enter your email and password to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="user@example.com"
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
            <Button type="submit"
            disabled = {isPending}
            className="w-full relative">
              {isPending ? (
                <span className="absolute inset-0 flex justify-center items-center">
                  <Spinner />
                </span>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="underline text-blue-500 dark:text-blue-400"
          >
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
