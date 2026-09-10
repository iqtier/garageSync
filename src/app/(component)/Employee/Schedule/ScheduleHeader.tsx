import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight,  } from "lucide-react";

type ScheduleHeaderProps = {
    currentWeekStart: Date;
    handleWeekChange: (direction: "next" | "prev") => void;
};

export function ScheduleHeader({
                                 currentWeekStart,
                                 handleWeekChange,
                             }: ScheduleHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-4">
            <Button
                onClick={() => handleWeekChange("prev")}
                className="px-2 py-1 rounded-lg"
            >
             <ArrowBigLeft /> Previous Week
            </Button>
            <h2 className="text-xl font-semibold">
                {format(currentWeekStart, "MMMM dd")} -{" "}
                {format(
                    new Date(
                        currentWeekStart.getFullYear(),
                        currentWeekStart.getMonth(),
                        currentWeekStart.getDate() + 6
                    ),
                    "MMMM dd, yyyy"
                )}
            </h2>
            <Button
                onClick={() => handleWeekChange("next")}
                className="px-2 py-1  rounded-lg"
            >
                Next Week <ArrowBigRight />
            </Button>
        </div>
    );
}