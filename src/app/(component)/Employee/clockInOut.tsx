"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputOtp } from "@heroui/input-otp";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import {
  ClockIn,
  ClockOut,
  getCurrentClockedInUsers,
} from "@/app/actions/employeeActions";
import { form } from "@heroui/theme";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { useSession } from "next-auth/react";
import { User } from "@/types/type";

const FormSchema = z.object({
  pin: z.string().min(4, {
    message: "Your employee pin must be 4 characters.",
  }),
});

interface UserData {
  name: string;
  role: string;
  startTime: Date;
  clockOut: Date | null;
}

export const ClockInForm : React.FC<{businessId:string }> = ({businessId}) => {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUsers, setCurrentUsers] = useState<UserData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchCurrentUsers = useCallback(async () => {
    const users = await getCurrentClockedInUsers(businessId);
    setCurrentUsers(users);
  }, []);

  useEffect(() => {
    fetchCurrentUsers();
  }, [fetchCurrentUsers]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const clockInform = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const clockOutform = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function clockIn(data: z.infer<typeof FormSchema>) {
    const result = await ClockIn(data.pin);
    if (result.status === "success") {
      toast.success("Employee Clocked In successfully");
      router.refresh();
      clockInform.reset();
      fetchCurrentUsers(); // Update users
    } else {
      clockInform.setError("root.serverError", {
        message: result.error as string,
      });
      toast.error(`${result.error}`);
    }
  }

  async function clockOut(data: z.infer<typeof FormSchema>) {
    const result = await ClockOut(data.pin);
    if (result.status === "success") {
      toast.success("Employee Clocked Out successfully");
      router.refresh();
      clockOutform.reset();
      fetchCurrentUsers(); // Update users
    } else {
      clockOutform.setError("root.serverError", {
        message: result.error as string,
      });
      toast.error(`${result.error}`);
    }
  }

  const calculateDuration = (startTime: Date) => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const durationInSeconds = Math.floor((now - start) / 1000);
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatShiftTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Card className="bg-green-50 dark:bg-cyan-950">
        <CardHeader>
          <CardTitle>Clock In</CardTitle>
          <CardDescription>Enter Your Employee Id to clock In</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...clockInform}>
            <form
              onSubmit={clockInform.handleSubmit(clockIn)}
              className="space-y-6"
            >
              <FormField
                control={clockInform.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Employee Id</FormLabel>
                    <FormControl>
                      <InputOtp
                        {...field}
                        color="primary"
                        size="lg"
                        length={4}
                        variant="faded"
                        classNames={{
                          segmentWrapper: "gap-x-3",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Clock In
              </Button>
              <div className="text-center mt-2 text-lg font-medium">
                {formatTime(currentTime)}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Card className="bg-purple-50 dark:bg-purple-950">
        <CardHeader>
          <CardTitle>Clock Out</CardTitle>
          <CardDescription>
            Enter Your Employee Id to clock out{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...clockOutform}>
            <form
              onSubmit={clockOutform.handleSubmit(clockOut)}
              className="space-y-6"
            >
              <FormField
                control={clockOutform.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Employee Id</FormLabel>
                    <FormControl>
                      <InputOtp
                        {...field}
                        color="danger"
                        size="lg"
                        length={4}
                        variant="faded"
                        classNames={{
                          segmentWrapper: "gap-x-3",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant="destructive" type="submit" className="w-full">
                Clock Out
              </Button>
              <div className="text-center mt-2 text-lg font-medium">
                {formatTime(currentTime)}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Card className="bg-blue-50  flex-grow dark:bg-blue-950">
        <CardHeader>
          <CardTitle>Current Employees</CardTitle>
          <CardDescription>
            Employees who are currently clocked in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {currentUsers.length === 0 ? (
              <p className="text-center text-lg font-medium ">
                No employees currently clocked in.
              </p>
            ) : (
              <ul className="space-y-2">
                {currentUsers.map((user) => (
                  <li
                    key={user.name}
                    className="bg-white dark:bg-zinc-800 rounded-lg shadow py-2 px-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-600 dark:text-blue-200">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold ">{user.name}</p>
                        <p className="text-sm ">
                          Role: <span className="font-medium">{user.role}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm  font-medium">
                        Started:{" "}
                        <span className="font-bold">
                          {formatShiftTime(user.startTime)}
                        </span>
                      </p>
                      <p className="text-sm  font-medium">
                        Working For:{" "}
                        <span className="font-bold">
                          {calculateDuration(user.startTime)}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
