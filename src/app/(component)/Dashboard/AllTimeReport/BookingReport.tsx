"use client";

import React, { useState, useEffect } from "react";

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
import { Booking, User } from "@/types/type";
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

const BookingReport = () => {
  const { data: session, status, update } = useSession();
  useEffect(() => {
    if (status === 'loading' || !session) {
      update();
    }
  }, [session, status, update]);
  const user = session?.user as User;

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBookings = await getAllBookings(user.business_Id as string);

        if (allBookings) {
          setBookings(allBookings);
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

  const totalRevenue = filteredBookings?.reduce((acc, booking) => {
    let serviceRevenue =
      booking.services?.reduce((serviceAcc, serviceItem) => {
        const price = serviceItem.service?.price || 0;
        const qty = parseInt(serviceItem.qty, 10) || 1;
        return serviceAcc + price * qty;
      }, 0) || 0;

    let inventoryRevenue =
      booking.UsedInventory?.reduce((inventoryAcc, inventoryItem) => {
        if (!inventoryItem.includedWithService) {
          const retailPrice = inventoryItem.inventory?.retailPrice || 0;
          const quantity = inventoryItem.quantity || 1;
          return inventoryAcc + retailPrice * quantity;
        }
        return inventoryAcc;
      }, 0) || 0;
    return acc + serviceRevenue + inventoryRevenue;
  }, 0);

  const topSellingServices = () => {
    if (!filteredBookings) return [];

    const serviceCounts: { [key: string]: number } = {};

    filteredBookings.forEach((booking) => {
      booking.services?.forEach((serviceItem) => {
        const serviceName = serviceItem.service?.name;
        if (serviceName) {
          serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
        }
      });
    });

    // Convert the result into an array of objects instead of tuples
    return Object.entries(serviceCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })); // Convert tuple to object
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold ">BOOKINGS</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700",
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
        <Card className="bg-green-100 dark:bg-green-950 shadow-green-500 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${totalRevenue?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-100 dark:bg-green-950 shadow-green-500 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {filteredBookings?.length}
            </div>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Across all bookings
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="  bg-green-100 dark:bg-green-950 shadow-green-500 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Booking Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-500 dark:text-gray-400">
                Completed:{" "}
                {
                  filteredBookings?.filter(
                    (booking) => booking.status === "completed"
                  ).length
                }
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Ongoing:{" "}
                {
                  filteredBookings?.filter(
                    (booking) => booking.status === "ongoing"
                  ).length
                }
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Cancelled:{" "}
                {
                  filteredBookings?.filter(
                    (booking) => booking.status === "cancelled"
                  ).length
                }
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Pending:{" "}
                {
                  filteredBookings?.filter(
                    (booking) => booking.status === "pending"
                  ).length
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Selling Services
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Most requested services based on booking history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-4">
              {topSellingServices().map(({ name, count }) => (
                <li key={name} className="text-gray-900 dark:text-gray-400">
                  {name} ({count} bookings)
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to prevent typescript errors

export default BookingReport;
