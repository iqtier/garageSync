"use client";
import React, { useEffect, useState } from "react";
import { Booking, User } from "@/types/type";
import {
  calculateBookingEarnings,
  getBooking,
} from "@/app/actions/bookingActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Check, Printer } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { getBusinessById } from "@/app/actions/settingActions";

const BookingDetails: React.FC<{ booking_id: string, businessId:string }> = ({ booking_id, businessId }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [tax_rate, setTax_rate] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentBooking = await getBooking(booking_id);
        const business = await getBusinessById(businessId);
        if(business) {setTax_rate(business.taxRate)}
        if (currentBooking) {
          setBooking(currentBooking);
          const bookingCost = await calculateBookingEarnings(booking_id);
          if (currentBooking.customer.discounted) {
            if (currentBooking.customer.discountType === "percentage") {
              setDiscount(
                bookingCost * (currentBooking.customer.discountRate / 100)
              );
            } else {
              setDiscount(currentBooking.customer.discountRate);
            }
          }
          setSubtotal(bookingCost);
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [booking_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-semibold mb-4">Booking Details</h1>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>Booking not found</p>
      </div>
    );
  }

  const isPaid = booking.payment_status === "paid";
  const isCompleted = booking.status === "completed";

  const handleCreateInvoiceClick = () => {
    window.open(
      `/home/bookings/${booking_id}/pdf`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  console.log(booking.start);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-semibold text-center mb-6 dark:text-white">
          Booking Details
        </h1>
        <p className="text-sm text-gray-500 text-center mb-4 dark:text-gray-400">
          Booking ID: {booking_id}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Details */}
          <div>
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-300">
              Customer
            </h2>
            <p className="dark:text-gray-400">{booking.customer.name}</p>
            <p className="dark:text-gray-400">{booking.customer.email}</p>
            <p className="dark:text-gray-400">{booking.customer.phone}</p>
          </div>

          {/* Vehicle Details */}
          <div>
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-300">
              Vehicle
            </h2>
            <p className="dark:text-gray-400">
              {booking.vehicle?.make} {booking.vehicle?.model} (
              {booking.vehicle?.year})
            </p>
            <p className="dark:text-gray-400">
              Booking Type: {booking.booking_type}
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Services Table */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-300">
            Services
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full dark:text-gray-400">
              <thead>
                <tr>
                  <th className="py-2 px-4 font-bold text-left">Service</th>
                  <th className="py-2 px-4 font-bold text-left">Quantity</th>
                  <th className="py-2 px-4 font-bold text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {booking.services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 px-4">{service.service.name}</td>
                    <td className="py-2 px-4">{service.qty}</td>
                    <td className="py-2 px-4">
                      $
                      {(service.service.price * parseInt(service.qty)).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="py-2 px-4 font-bold text-right">
                    Services Total:
                  </td>
                  <td className="py-2 px-4 font-bold">
                    $
                    {booking.services
                      .reduce(
                        (acc, service) =>
                          acc + service.service.price * parseInt(service.qty),
                        0
                      )
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Inventories Table */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-300">
            Inventories
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full dark:text-gray-400">
              <thead>
                <tr>
                  <th className="py-2 px-4 font-bold text-left">Inventory</th>
                  <th className="py-2 px-4 font-bold text-left">Quantity</th>
                  <th className="py-2 px-4 font-bold text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {booking.UsedInventory.map((inventory) => (
                  <tr
                    key={inventory.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 px-4">
                      {`${inventory.inventory.brand} ${
                        inventory.inventory.name
                      } ${inventory.inventory.InventoryFields?.map(
                        (field) => field.value
                      ).join(" ")}`}
                    </td>
                    <td className="py-2 px-4">
                      {inventory.quantity} {inventory.inventory.measure_of_unit}
                    </td>
                    <td className="py-2 px-4">
                      $
                      {(
                        inventory.inventory.retailPrice * inventory.quantity
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="py-2 px-4 font-bold text-right">
                    Inventories Total:
                  </td>
                  <td className="py-2 px-4 font-bold">
                    $
                    {booking.UsedInventory.reduce(
                      (acc, inventory) =>
                        acc +
                        inventory.inventory.retailPrice * inventory.quantity,
                      0
                    ).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Booking Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-300">
            Booking Details
          </h2>
          <div>
            <Label className="font-bold">Technicians:</Label>
            <ul className="list-disc pl-6">
              {booking.technicians.map((technician) => (
                <li key={technician.id}>{technician.technician.name}</li>
              ))}
            </ul>
          </div>
          <p>
            <span className="font-bold">Ramp: </span>
            <span className="dark:text-gray-400">{booking.ramp}</span>
          </p>
          <p>
            <span className="font-bold">Job Start: </span>

            <span className="dark:text-gray-400">
              {booking.start?.toLocaleDateString()} -{" "}
              {booking.start?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
          <p>
            <span className="font-bold">Job Completed: </span>
            <span className="dark:text-gray-400">
              {booking.finish?.toLocaleDateString()} -{" "}
              {booking.finish?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
          <p>
            <span className="font-bold">Booking Date: </span>
            <span className="dark:text-gray-400">
              {booking.date.toLocaleDateString()}
            </span>
          </p>
          <p>
            <span className="font-bold">Booking Time: </span>
            <span className="dark:text-gray-400">{booking.time}</span>
          </p>
          <div>
            Status:{" "}
            <Badge variant={isCompleted ? "default" : "destructive"}>
              {booking.status.toUpperCase()}
            </Badge>
          </div>
          <div>
            Payment Status:{" "}
            <Badge variant={isPaid ? "default" : "destructive"}>
              {booking.payment_status.toUpperCase()}
            </Badge>
          </div>
          <p className="dark:text-gray-400">Note: {booking.note}</p>
        </div>

        <Separator className="mb-6" />

        {/* Pricing Summary */}
        <div className="text-right">
          <div className="font-semibold text-lg mb-2 dark:text-gray-300">
            Invoice Summary
          </div>
          <p className="dark:text-gray-400">Subtotal: ${subtotal.toFixed(2)}</p>

          {discount > 0 && (
            <p className="dark:text-gray-400">
              Discount: - ${discount.toFixed(2)}
            </p>
          )}
          <p className="dark:text-gray-400">
            Tax ({tax_rate * 100}%): $
            {((subtotal - discount) * tax_rate).toFixed(2)}
          </p>
          <p className="font-bold text-lg dark:text-white">
            Total: $
            {(subtotal - discount + (subtotal - discount) * tax_rate).toFixed(
              2
            )}
          </p>
        </div>

        <Button
          disabled={!isPaid}
          className="mt-8 w-full md:w-auto font-bold"
          onClick={handleCreateInvoiceClick}
        >
          <Printer className="h-4 w-4 mr-2" /> Create Invoice
          {isPaid && <Check className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default BookingDetails;
