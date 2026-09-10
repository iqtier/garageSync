/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types/type";
import { User } from "@prisma/client";
import { EmployeeScheduleSchema } from "@/types/type";
import { z } from "zod";

export async function deleteEmployee(
  email: string
): Promise<ActionResult<User>> {
  try {
    const deleteuser = await prisma.user.delete({
      where: { email: email },
    });
    return { status: "success", data: deleteuser };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}

export async function getAllEmployees(businessId: string) {
  const employees = await prisma.user.findMany({
    where: {
      business_Id: businessId,
    },
    include: {
      bookings: true,
      ClockInOut: true,
    },
  });
  return employees;
}

export async function ClockIn(pin: string): Promise<ActionResult<User>> {
  const employee = await prisma.user.findUnique({
    where: { pin },
  });

  if (!employee) {
    return { status: "error", error: "Pin is not valid" };
  }

  try {
    const lastClockInRecord = await prisma.clockInOut.findFirst({
      where: {
        userId: employee.id,
        clockOut: null,
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    if (lastClockInRecord) {
      return { status: "error", error: "Employee is currently clocked in" };
    }
    await prisma.clockInOut.create({
      data: {
        userId: employee.id,
        clockIn: new Date(),
      },
    });
    return { status: "success", data: employee };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}

export async function ClockOut(pin: string): Promise<ActionResult<User>> {
  const employee = await prisma.user.findUnique({
    where: { pin },
  });

  if (!employee) {
    return { status: "error", error: "Pin is not valid" };
  }

  try {
    const lastClockInRecord = await prisma.clockInOut.findFirst({
      where: {
        userId: employee.id,
        clockOut: null,
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    if (!lastClockInRecord) {
      return {
        status: "error",
        error: "No current clock-in to clock out from",
      };
    }

    const clockInTime = lastClockInRecord.clockIn.getTime();
    const clockOutTime = new Date().getTime();
    const diffInMilliseconds = clockOutTime - clockInTime;
    const hoursWorked = diffInMilliseconds / (1000 * 60 * 60);

    await prisma.clockInOut.update({
      where: { id: lastClockInRecord.id },
      data: {
        clockOut: new Date(),
        hoursWorked,
      },
    });

    return { status: "success", data: employee };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}

export async function getTechnicians(businesId: string) {
  return prisma.user.findMany({
    where: {
      business_Id: businesId,
      role: "technician",
    },
    include: {
      bookings: true,
      ClockInOut: true,
    },
  });
}

export async function getCurrentClockedInUsers(businesId: string) {
  try {
    const currentUsers = await prisma.clockInOut.findMany({
      where: {
        clockOut: null,
        user: {
          business_Id: businesId,
        },
      },
      include: {
        user: true,
      },
    });

    const modifiedUsers = currentUsers.map((user) => ({
      name: user.user.name,
      role: user.user.role,
      startTime: user.clockIn,
      clockOut: user.clockOut,
    }));
    return modifiedUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateSchedule(
  userId: string,
  date: string,
  status: string,
  businesId: string
) {
  try {
    const newDate = new Date(date).toISOString();
    await prisma.employeeSchedule.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: new Date(newDate),
        },
        user: {
          business_Id: businesId,
        },
      },
      update: {
        status: status,
      },
      create: {
        userId: userId,
        date: new Date(newDate),
        status: status,
      },
    });
    return { status: "success" };
  } catch (error) {
    return { status: "error", error };
  }
}
export async function fetchScheduleData(weekDays: Date[],businesId: string) {
  const scheduleData = await prisma.employeeSchedule.findMany({
    where: {
      date: {
        gte: new Date(weekDays[0].toLocaleDateString()),
        lte: new Date(weekDays[weekDays.length - 1].toLocaleDateString()),
      },
      user:{
        business_Id: businesId
      },
    },
    select: {
      userId: true,
      date: true,
      status: true,
    },
  });

  return scheduleData;
}




