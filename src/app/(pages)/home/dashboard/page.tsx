import AllTimeReport from "@/app/(component)/Dashboard/AllTimeReport/AllTimeReport";
import CompletedJobs from "@/app/(component)/Dashboard/CompletedJobs";
import CurrentJobs from "@/app/(component)/Dashboard/CurrentJobs";
import UpcomingJobs from "@/app/(component)/Dashboard/UpcomingJobs";
import { getUserById } from "@/app/actions/authActions";
import { getAllBookings } from "@/app/actions/bookingActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { Cog, History } from "lucide-react";

import React from "react";

const page = async () => {
  const session = await auth();
  const currentUser = await getUserById(session?.user?.id as string);

  const bookings = await getAllBookings(currentUser?.business_Id as string);
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="mb-3  grid grid-cols-2 w-full">
          <TabsTrigger
            value="current"
            className="data-[state=active]:bg-green-500/80  "
          >
            <Cog
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Current
          </TabsTrigger>
          <TabsTrigger
            value="alltime"
            className="data-[state=active]:bg-green-500/80  "
          >
            <History
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            All time
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <div className="flex flex-wrap gap-4">
            <CurrentJobs bookings={bookings} />
            <UpcomingJobs bookings={bookings} />
            <CompletedJobs bookings={bookings} />
          </div>
        </TabsContent>
        <TabsContent value="alltime">
          <AllTimeReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
