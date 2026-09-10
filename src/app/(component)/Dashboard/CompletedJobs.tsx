"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllBookings } from "@/app/actions/bookingActions";
import { Booking } from "@/types/type";
import { DataTableRowActions } from "../Bookings/booking_row_actions";
import { format } from "date-fns";
interface CompletedJobsProps {
  bookings: Booking[] | null;
}
const CompletedJobs: React.FC<CompletedJobsProps> = ({ bookings }) => {
  if (!bookings) {
    return <div>Loading bookings...</div>;
  }
  const today = new Date();
    const formattedToday = format(today, "yyyy-MM-dd");

  const completedBookings = bookings?.filter((booking) => {
        const formattedBookingDate = format(booking.date, "yyyy-MM-dd");
        return booking.status === "completed" && formattedBookingDate === formattedToday;
  });


  if (!completedBookings || completedBookings.length === 0) {
    return (
      <Card className="flex-grow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">
            Completed Jobs
          </CardTitle>
          <CardDescription>No completed jobs for today.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex-grow dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="font-semibold text-2xl">
          Completed Jobs
        </CardTitle>
        <CardDescription>List of the Jobs that have been completed today.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-4">
          {completedBookings.map((booking) => (
            <li
                key={booking.id}
                className="border relative rounded-lg p-4 bg-gray-50 dark:bg-gray-600 shadow-green-500 shadow-lg"
                    >
                <div className="flex flex-wrap justify-between gap-x-4">
                  <div>
                    <p>
                      <span className="font-semibold">Job ID:</span> {booking.id}
                    </p>
                    <p>
                      <span className="font-semibold">Customer:</span>{" "}
                      {booking.customer?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Vehicle:</span>{" "}
                      {booking.vehicle?.make} {booking.vehicle?.model} (
                      {booking.vehicle?.year})
                    </p>
                    <p>
                        <span className="font-semibold">Ramp:</span> {booking.ramp}
                      </p>
                    <p>
                      <span className="font-semibold">Time:</span> {booking.time}
                    </p>
                    <div className="flex gap-x-4 pr-2">
                      <span className="font-semibold">Services:</span>{" "}
                      <ul>
                        {booking.services?.map((s) => (
                          <li key={s.service?.id}>
                            {s.qty} X {s.service?.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="absolute  top-4 right-4">
                    <div className=" bg-green-200 dark:bg-green-700 p-2 rounded-full ">
                      <DataTableRowActions booking_id={booking.id.toString()} />
                    </div>
                  </div>
                </div>
              </li>
          ))}
        </ul>
      </CardContent>

    </Card>
  );
};

export default CompletedJobs;