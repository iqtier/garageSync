"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScheduleRow } from "./ScheduleRow";
import { Button } from "@/components/ui/button";
import {
  fetchScheduleData,
  getTechnicians,
  updateSchedule,
} from "@/app/actions/employeeActions";
import { ScheduleHeader } from "./ScheduleHeader";
import { toast } from "react-toastify";
import { User } from "@/types/type";


const ScheduleSchema = z.object({
  schedules: z.record(
    z.string(),
    z.enum(["on", "off", "sick", "vacation", "available"])
  ),
});

type ScheduleForm = z.infer<typeof ScheduleSchema>;

const  ScheduleTable: React.FC<{businessId:string }> = ({businessId}) => {
  const { data: session, status, update } = useSession();
  useEffect(() => {
    if (status === 'loading' || !session) {
      update();
    }
  }, [session, status, update]);
  const user = session?.user as User;
  const isUserAdmin = user?.role === "admin";

  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [scheduleData, setScheduleData] = useState<{ [key: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [initialFormValues, setInitialFormValues] = useState<
    ScheduleForm["schedules"]
  >({});

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ScheduleForm>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: { schedules: {} },
    mode: "onChange",
  });

  const watchedScheduleValues = watch("schedules");

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
  });

  useEffect(() => {
    const fetchTechniciansAndSchedules = async () => {
      setLoading(true);
      const techData = await getTechnicians(businessId);

      if (techData) {
        setTechnicians(techData);
        const scheduleFetch = await fetchScheduleData(weekDays,businessId);

        const initialSchedules = techData.reduce((acc: any, tech: any) => {
          weekDays.forEach((day) => {
            const schedule = scheduleFetch.find(
              (schedule) =>
                schedule.userId === tech.id &&
                isSameDay(
                  new Date(schedule.date.toISOString().split("T")[0]),
                  day.toISOString().split("T")[0]
                )
            );
            acc[`${tech.id}_${format(day, "yyyy-MM-dd")}`] =
              schedule?.status || "off";
          });
          return acc;
        }, {});
        setScheduleData(initialSchedules);
        setInitialFormValues(initialSchedules);
        reset({ schedules: initialSchedules });
      }

      setLoading(false);
    };

    fetchTechniciansAndSchedules();
  }, [currentWeekStart, reset, setValue]);

  const handleWeekChange = (direction: "next" | "prev") => {
    setCurrentWeekStart((prev) =>
      direction === "next" ? addDays(prev, 7) : addDays(prev, -7)
    );
  };

  const onSubmit = async (data: ScheduleForm) => {
    const changedSchedules = Object.entries(watchedScheduleValues).filter(
      ([key, value]) => initialFormValues[key] !== value
    );

    try {
      const responses = await Promise.all(
        changedSchedules.map(async ([key, status]) => {
          const [userId, date] = key.split("_");
          const utcDate = new Date(date).toISOString().split("T")[0];
          return await updateSchedule(userId, utcDate, status,businessId);
        })
      );
      if (responses.every((res) => res.status === "success")) {
        const scheduleFetch = await fetchScheduleData(weekDays,businessId);
        const initialSchedules = technicians.reduce((acc: any, tech: any) => {
          weekDays.forEach((day) => {
            const schedule = scheduleFetch.find(
              (schedule) =>
                schedule.userId === tech.id &&
                isSameDay(
                  new Date(schedule.date.toISOString().split("T")[0]),
                  day.toISOString().split("T")[0]
                )
            );
            acc[`${tech.id}_${format(day, "yyyy-MM-dd")}`] =
              schedule?.status || "off";
          });
          return acc;
        }, {});
        setScheduleData(initialSchedules);
        setInitialFormValues(initialSchedules);
        reset({ schedules: initialSchedules });
        toast.success("Schedule updated successfully");
      }
      
    } catch (error) {
      toast.error("Error updating schedule");
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ScheduleHeader
        currentWeekStart={currentWeekStart}
        handleWeekChange={handleWeekChange}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full  bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 ">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-2 px-4 border-b font-semibold text-left dark:border-gray-600">
                Employee Name
              </th>
              {weekDays.map((day) => (
                <th
                  key={format(day, "yyyy-MM-dd")}
                  className="py-2 px-4 border-b font-semibold dark:border-gray-600"
                >
                  {format(day, "EEE dd")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              technicians.map((technician) => (
                <ScheduleRow
                  key={technician.id}
                  technician={technician}
                  weekDays={weekDays}
                  control={control}
                  errors={errors}
                  scheduleData={scheduleData}
                  setScheduleData={setScheduleData}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Button type="submit" disabled={!isDirty || !isUserAdmin}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-calendar-sync"
          >
            <path d="M11 10v4h4" />
            <path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5" />
            <path d="M16 2v4" />
            <path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5" />
            <path d="M21 22v-4h-4" />
            <path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" />
            <path d="M3 10h4" />
            <path d="M8 2v4" />
          </svg>{" "}
          Update Schedule
        </Button>
      </div>
    </form>
  );
}

export default ScheduleTable