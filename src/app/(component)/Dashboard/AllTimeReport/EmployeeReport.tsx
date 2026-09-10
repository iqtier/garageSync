"use client";

import React, { useState, useEffect, useMemo } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { getAllBookings } from "@/app/actions/bookingActions";
import { getAllEmployees, getTechnicians } from "@/app/actions/employeeActions";
import { getAllCustomer } from "@/app/actions/customerActions";
import { getAllInventory } from "@/app/actions/inventoryActions";

import { Booking, Customer, User } from "@/types/type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { useUserStore } from "@/app/store/useUserStore";
import { useSession } from "next-auth/react";

const EmployeeReport = () => {
  const [employees, setEmployees] = useState<User[] | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  const { data: session, status, update } = useSession();
  useEffect(() => {
    if (status === 'loading' || !session) {
      update();
    }
  }, [session, status, update]);
  const user = session?.user as User;
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEmployees = await getAllEmployees(user.business_Id as string);
        const allBookings = await getAllBookings(user.business_Id as string);

        if (allBookings && allEmployees) {
          setBookings(allBookings);

          setEmployees(allEmployees);
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading data...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredBookings = bookings?.filter((booking) => {
    if (!date?.from || !date?.to) return true;
    const bookingDate = new Date(booking.date);
    return bookingDate >= date.from && bookingDate <= date.to;
  });

  const filteredEmployees = employees?.filter((employee) => {
    if (!date?.from || !date?.to) return true;

    return employee.ClockInOut.some((entry) => {
      // Check if clockIn and clockOut are within the selected range
      return (
        date.from &&
        date.to &&
        entry.clockIn >= date.from &&
        entry.clockOut !== null &&
        entry.clockOut <= date.to
      );
    });
  });

  const employeersBookingCount = () => {
    if (!filteredBookings) return [];
    const bookingCount: { [key: string]: { name: string; count: number } } = {};
    filteredBookings?.forEach((booking) => {
      booking.technicians?.forEach((technician) => {
        if (!bookingCount[technician.technicianId]) {
          bookingCount[technician.technicianId] = {
            name: technician.technician.name,
            count: 0,
          };
        }
        bookingCount[technician.technicianId].count += 1;
      });
    });
    return Object.values(bookingCount).sort((a, b) => b.count - a.count);
  };

  // Convert the result into an array of objects instead of tuples

  const topEmployeeHours = () => {
    if (!filteredEmployees) return [];

    const employeeHours: { [key: string]: { name: string; hours: number } } =
      {};

    filteredEmployees.forEach((employee) => {
      const employeeId = employee.id;
      const employeeName = employee.name;
      employee.ClockInOut?.forEach((attendance) => {
        if (employeeId && attendance) {
          if (!employeeHours[employeeId]) {
            employeeHours[employeeId] = { name: employeeName, hours: 0 };
          }
          employeeHours[employeeId].hours += attendance.hoursWorked || 0;
        }
      });
    });

    // Convert to an array and sort by hours worked

    return Object.values(employeeHours)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
  };

  console.log(topEmployeeHours());
  console.log(filteredEmployees);
  console.log(employeersBookingCount());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Employee</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal  text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "MMM dd, yyyy")} - ${format(
                    date.to,
                    "MMM dd, yyyy"
                  )}`
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            align="start"
          >
            <Calendar
              className="rounded-md border p-2"
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              pagedNavigation
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {employees?.length}
            </div>
            <div className="mt-5 space-y-2">
              <p className="text-gray-500 dark:text-gray-400">
                Admin:{" "}
                {
                  employees?.filter((employee) => employee.role === "admin")
                    .length
                }
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Technician:{" "}
                {
                  employees?.filter(
                    (employee) => employee.role === "technician"
                  ).length
                }
              </p>
            </div>

            <CardDescription className="text-gray-500 dark:text-gray-400"></CardDescription>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Employee Hours
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Most Hours worked by employee.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-4">
              {topEmployeeHours().map(({ name, hours }, index) => (
                <li key={index} className="text-gray-900 dark:text-gray-400">
                  {name} ({hours.toFixed(2)} hours)
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Employee Bookings
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Most bookings done by employee.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-4">
              {employeersBookingCount().map(({ name, count }, index) => (
                <li key={index} className="text-gray-900 dark:text-gray-400">
                  {name} ({count} bookings)
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2"></div>
    </div>
  );
};

// Helper function to prevent typescript errors

export default EmployeeReport;
