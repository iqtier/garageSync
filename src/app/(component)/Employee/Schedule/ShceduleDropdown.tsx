import React from "react";
import { useController, Control, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ScheduleDropdownProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors<any>;
  onStatusChange: (value: string) => void;
  defaultValue?: string;
};

export function ScheduleDropdown({
  name,
  control,
  errors,
  onStatusChange,
  defaultValue,
}: ScheduleDropdownProps) {
  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue,
  });

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "on":
        return "bg-green-300 dark:bg-green-700";
      case "off":
        return "bg-red-300 dark:bg-red-700";
      case "sick":
        return "bg-orange-300 dark:bg-yellow-700";
      case "vacation":
        return "bg-purple-300 dark:bg-purple-700";
      case "available":
        return "bg-cyan-300 dark:bg-cyan-700";
      default:
        return "bg-lime-300 dark:bg-gray-800";
    }
  };

  const getStatusTextColor = (status: string | undefined) => {
    return "text-black dark:text-white";
  };

  return (
    <Select
      onValueChange={(value) => {
        field.onChange(value);
        onStatusChange(value);
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger
        className={cn(
          "w-full  dark:border-gray-700",
          getStatusColor(field.value)
        )}
      >
        <SelectValue className={cn(getStatusTextColor(field.value))}>
          {field.value
            ? field.value.charAt(0).toUpperCase() + field.value.slice(1)
            : "Select Status"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="on">
          <span className="text-green-500 ">On</span>
        </SelectItem>
        <SelectItem value="off">
          <span className=" text-red-500 ">Off</span>
        </SelectItem>
        <SelectItem value="sick">
          <span className="text-yellow-500 ">Sick</span>
        </SelectItem>
        <SelectItem value="vacation">
          <span className=" text-purple-500 ">
            Vacation
          </span>
        </SelectItem>
        <SelectItem value="available">
          <span className=" text-cyan-500 ">
            Available
          </span>
        </SelectItem>
      </SelectContent>
      {errors[name]?.message && typeof errors[name]?.message === "string" && (
        <span className="text-red-500 text-sm">{errors[name].message}</span>
      )}
    </Select>
  );
}
