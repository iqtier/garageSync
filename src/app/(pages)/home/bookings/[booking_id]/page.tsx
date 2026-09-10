import React from "react";
import BookingDetails from "@/app/(component)/Bookings/BookingDetails";
import { auth } from "@/lib/auth";
import { User } from "@/types/type";

const page = async ({
  params,
}: {
  params: Promise<{ booking_id: string }>;
}) => {
  const { booking_id } = await params;
  const session = await auth()
  const user = session?.user as User

  return <BookingDetails booking_id={booking_id} businessId= {user.business_Id as string} />;
};

export default page;
