"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./booking_row_actions";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import React from "react";


type ServiceDetail = {
    name: string;
    quantity: string;
};

type BookingDetail = {
    bookingid: number;
    date: string;
    time: string;
    customer: string;
    ramp: string | null;
    vehicle: {
        id: number | null;
        details: string;
    };
    services: ServiceDetail[];
    status: string;
    note: string;
    technicians: string;
    payment_status: string;
    payment_method: string;
    booking_type: string | null;
};

export const columns: ColumnDef<BookingDetail>[] = [
     {
      accessorKey: "bookingid",
      header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">ID</div>,
          cell: ({ row }) =>  <div className="text-gray-900 dark:text-gray-400 text-sm">{row.original.bookingid}</div>,
          
        },
  {
       accessorKey: "date",
    header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Date</div>,
     cell: ({ row }) =>  <div className="text-gray-900 dark:text-gray-400 text-sm">{row.original.date}</div>,
  },
  {
    accessorKey: "time",
     header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Time</div>,
    cell: ({ row }) =>  <div className="text-gray-900 dark:text-gray-400 text-sm">{row.original.time}</div>,
  },
   {
       accessorKey: "ramp",
     header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Ramp</div>,
       cell: ({ row }) => {
           const ramp = row.original.ramp as string;
           const isNA = ramp === "0"
           return <div className="text-gray-900 dark:text-gray-400 text-sm"> {isNA ? "N/A" :ramp}</div>;
       },
  },
   {
       accessorKey: "customer",
     header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Customer</div>,
    cell: ({ row }) => (
      <div className="text-gray-900 dark:text-gray-400 text-sm">
        {row.original.customer}
          </div>
      ),
  },
    {
      accessorKey: "vehicle",
    header: () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Vehicle</div>,
      cell: ({ row }) => {
        return (
          <div className="text-gray-900 dark:text-gray-400 text-sm">
            {row.original.vehicle ? row.original.vehicle.details : "No Vehicle associated"}
          </div>
        );
      },
  },
  {
    accessorKey: "services",
    header: () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Services</div>,
        cell: ({ row }) => {
            const services = row.original.services as ServiceDetail[];
            return (
                <div className="text-gray-900 dark:text-gray-400 text-sm">
                    {services?.map((service) => (
                        <div key={service.name}>
                            {service.name} - {service.quantity}
                        </div>
                    ))}
                </div>
            );
        },
  },
    {
      accessorKey: "status",
    header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Status</div>,
        cell: ({ row }) => {
            const status = row.original.status as string;
            const isCompleted = status === "completed";
            const isOnGoing = status === "ongoing";
            const isCancelled = status === "cancelled";
            return  <Badge
                className={cn(
                  "uppercase text-xs font-bold text-white",
                  isCompleted && "bg-green-500 dark:bg-green-700",
                  isOnGoing && "bg-orange-500 dark:bg-orange-700",
                  isCancelled && "bg-red-500 dark:bg-red-700",
                  !isCompleted && !isOnGoing && !isCancelled && "bg-blue-500 dark:bg-blue-700",

                )}
              >
                {status}
            </Badge>
        },
    },
      {
        accessorKey: "payment_status",
         header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Payment Status</div>,
          cell: ({ row }) => {
            const payment_status = row.original.payment_status as string;
            const isPaid = payment_status === "paid";
              const isCharge = payment_status === "charge";
            const isUnpaid = payment_status === "unpaid";
              return (
                  <Badge
                      className={cn(
                          "uppercase text-xs font-bold text-white",
                          isPaid && "bg-green-500 dark:bg-green-700",
                         isCharge && "bg-orange-500 dark:bg-orange-700",
                          isUnpaid && "bg-red-500 dark:bg-red-700",
                            !isPaid && !isCharge && !isUnpaid && "bg-blue-500 dark:bg-blue-700"
                      )}
                  >
                    {payment_status}
                  </Badge>
                );
          },
  },
  {
    accessorKey: "payment_method",
    header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Payment Method</div>,
      cell: ({ row }) =>  <div className="p-1 flex justify-center rounded-sm text-gray-900 dark:text-gray-400 text-sm">{row.original.payment_method.toUpperCase()}</div>,
  },
  {
    accessorKey: "technicians",
   header:  () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Technicians</div>,
    cell: ({ row }) =>  <div className="text-gray-900 dark:text-gray-400 text-sm">{row.original.technicians}</div>,
  },
   {
    accessorKey: "booking_type",
    header: () => <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Booking Type</div>,
     cell: ({ row }) => {
          const isAppointment = row.original.booking_type === "Appointment";

          return (
              <Badge
                  className={cn(
                      "uppercase text-xs font-bold text-white",
                      isAppointment ? " bg-blue-800" : "bg-green-800"
                  )}
              >
               {row.original.booking_type}
           </Badge>
          );
      },
  },

  {
    id: "actions",
     header:  () =>  <div className="text-left text-sm font-semibold text-gray-900 dark:text-gray-400">Actions</div>,
    cell: ({ row }) => {
      const booking_id = row.original.bookingid ;
      return <DataTableRowActions booking_id={booking_id.toString()} />;
    },
  },
];