/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { auth } from "@/lib/auth";

import { columns } from "@/app/(component)/Employee/userTableColumns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddEmployeeForm from "@/app/(component)/Employee/add-employee-form";

import { EmployeeTable } from "@/app/(component)/Employee/employee-table";
import { ClockInForm } from "@/app/(component)/Employee/clockInOut";

import  ScheduleTable  from "@/app/(component)/Employee/Schedule/ScheduleTable";
import { User } from "@/types/type";
import { getAllEmployees } from "@/app/actions/employeeActions";
import { CalendarClock, CalendarDays, FileUser } from "lucide-react";
const Page = async () => {
  const session = await auth();
  const currentUser = session?.user as User;
  
  const isAdmin = currentUser?.role === "admin";
  const employees = await getAllEmployees(currentUser.business_Id as string);

  return (
    <div className="">
      {isAdmin && <AddEmployeeForm businessId= {currentUser.business_Id as string} />}

      <Tabs defaultValue="Clock IN/Out" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="Clock IN/Out"
            className="data-[state=active]:bg-green-500/80  "
          >
            <CalendarClock  className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true"/>
            Clock IN/Out
          </TabsTrigger>
          <TabsTrigger
            value="Schedule"
            className="data-[state=active]:bg-green-500/80  "
          >
            <CalendarDays className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true"/>
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="List"
            className="data-[state=active]:bg-green-500/80  "
          >
            <FileUser className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true"/>
            List
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="Clock IN/Out"
          className="animate-in fade-in slide-in-from-bottom-10"
        >
          <ClockInForm businessId= {currentUser.business_Id as string}/>
        </TabsContent>
        <TabsContent
          value="Schedule"
          className="animate-in fade-in slide-in-from-bottom-10"
        >
          <ScheduleTable businessId= {currentUser.business_Id as string} />
        </TabsContent>
        <TabsContent
          value="List"
          className="animate-in fade-in slide-in-from-bottom-10"
        >
          <div className="mt-4">
            <EmployeeTable
              columns={columns}
              data={employees?.map((employee) => ({
                id: employee.id,
                email: employee.email,
                password: employee.password,
                role: employee.role,
                username: employee.name,
              }))}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
