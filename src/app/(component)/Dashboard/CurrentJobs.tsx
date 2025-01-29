"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllBookings } from "@/app/actions/bookingActions";
import { Booking } from "@/types/type";
import { DataTableRowActions } from "../Bookings/booking_row_actions";

interface CurrentJobsProps {
  bookings: Booking[] | null;
}
const CurrentJobs : React.FC<CurrentJobsProps> = ({ bookings }) => {
  
  if (!bookings) {
    return <div>Loading bookings...</div>;
  }


  const ongoingBookings = bookings?.filter((booking) => {
    return booking.status === "ongoing";
  });

  if (!ongoingBookings || ongoingBookings.length === 0) {
    return (
      <Card className="flex-grow ">
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">Ongoing Jobs</CardTitle>
          <CardDescription>No ongoing jobs at the moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex-grow">
      <CardHeader>
        <CardTitle className="font-semibold text-2xl">Ongoing Jobs</CardTitle>
        <CardDescription>Jobs currently in progress</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-4">
          {ongoingBookings.map((booking) => (
            <li
              key={booking.id}
              className="border relative rounded-md p-4 bg-gray-50 dark:bg-gray-800  shadow-sm"
            >
              <div className="flex flex-wrap justify-between gap-x-2 ">
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
                  <div className="flex gap-x-4 ">
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
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900  p-1">
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

export default CurrentJobs;
