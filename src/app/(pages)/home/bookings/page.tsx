import React, { Suspense } from "react";
import { format } from "date-fns";
import { getAllServices } from "@/app/actions/serviceActions";

import { getAllCustomer } from "@/app/actions/customerActions";

import { getAllBookings } from "@/app/actions/bookingActions";
import { columns } from "@/app/(component)/Bookings/bookingTableColums";
import { DataTable } from "@/app/(component)/Bookings/booking-table";
import BookingForm from "@/app/(component)/Bookings/booking_form";

import { getTechnicians } from "@/app/actions/employeeActions";
import { Spinner } from "@/components/ui/spinner";
import { Booking, Customer, Service, User } from "@/types/type";
import { getUserById } from "@/app/actions/authActions";
import { auth } from "@/lib/auth";

const Bookings = async () => {
   const session = await auth();
  const currentUser = await getUserById(session?.user?.id as string);
  const [services, customers, bookings, technicians] = await Promise.all([
    getAllServices(currentUser?.business_Id as string) as Promise<Service[]>,
    getAllCustomer(currentUser?.business_Id as string) as Promise<Customer[]>,
    getAllBookings(currentUser?.business_Id as string) as Promise<Booking[]>,
    getTechnicians(currentUser?.business_Id as string) as Promise<User[]>,
   ]);

   const data = bookings?.map((booking) => ({
    bookingid: booking.id,
    date: format(booking.date, "dd MMM yyyy"),
    time: booking.time,
    customer: booking.customer.name,
    ramp: booking.ramp,
    vehicle: {
      id: booking.vehicle ? booking.vehicle.id : null,
      details: booking.vehicle
        ? `${booking.vehicle.make} ${booking.vehicle.model} ${booking.vehicle.year}`
        : "No Vehicle associated",
    },
  
    services: booking.services?.map((sa) => ({
      name: sa.service.name,
      quantity: sa.qty,
    })),
    status: booking.status,
    note: booking.note,
    technicians: booking.technicians?.map((t) => t.technician.name).join(", "),
    booking_type: booking.booking_type ?? null, // Ensure it's never undefined
    payment_status: booking.payment_status,
    payment_method: booking.payment_method,
  }));
  

  return (
    <div className="flex flex-col gap-y-4 animate-in fade-in slide-in-from-bottom-10">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
        <BookingForm
        businessId = {currentUser?.business_Id as string}
          services={services}
          customers={customers}
          isAppointment={true}
          isEdit={false}
          technicians={technicians}
        />
        <BookingForm
        businessId = {currentUser?.business_Id as string}
          services={services}
          customers={customers}
          isAppointment={false}
          isEdit={false}
          technicians={technicians}
        />
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        }
      >
        <DataTable columns={columns} data={data || []} />
      </Suspense>
    </div>
  );
};

export default Bookings;
