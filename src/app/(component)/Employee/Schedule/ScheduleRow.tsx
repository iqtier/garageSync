import React from "react";
import { format } from "date-fns";
import { ScheduleDropdown } from "./ShceduleDropdown";
import { Control, FieldErrors } from "react-hook-form";
import { User } from "@prisma/client";
import { CircleUser } from "lucide-react";
type ScheduleRowProps = {
  technician: User;
  weekDays: Date[];
  control: Control<any>;
  errors: FieldErrors<any>;
  scheduleData: { [key: string]: string };
  setScheduleData: (scheduleData: { [key: string]: string }) => void;
};
export function ScheduleRow({
  technician,
  weekDays,
  control,
  errors,
  scheduleData,
  setScheduleData,
}: ScheduleRowProps) {
  const handleDropdownChange = (day: Date, status: string) => {
    const key = `${technician.id}_${format(day, "yyyy-MM-dd")}`;
    setScheduleData({ ...scheduleData, [key]: status });
  };

  return (
    <tr key={technician.id}>
      <td className="p-2 gap-x-2 w-[165px] items-center justify-start border-b text-left dark:border-gray-600">
        <div className=" flex items-center gap-x-4 text-blue-600 dark:text-blue-200">
        <CircleUser /> {technician.name} 
        </div>
      </td>
      {weekDays.map((day) => {
        const key = `${technician.id}_${format(day, "yyyy-MM-dd")}`;
        const status = scheduleData[key];

        return (
          <td
            key={format(day, "yyyy-MM-dd")}
            className={`py-2 px-4  border  dark:border-gray-600`}
          >
            <ScheduleDropdown
              name={`schedules.${key}`}
              control={control}
              errors={errors}
              onStatusChange={(value) => handleDropdownChange(day, value)}
              defaultValue={status}
            />
          </td>
        );
      })}
    </tr>
  );
}
