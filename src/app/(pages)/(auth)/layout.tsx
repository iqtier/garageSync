"use client"
import { LoginForm } from "@/app/(component)/Authentication/login-form";
import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Users, FileText, ClipboardList, PackageCheck, BarChart, Cog } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
const features = [
  { 
    icon: <BarChart className="text-green-700 size-10" />, 
    title: "Dashboard", 
    description: "Get an overview of all activities in your garage, including bookings, inventory, and employee stats."
  },
  { 
    icon: <CalendarCheck className="text-blue-600 size-10" />, 
    title: "Booking System", 
    description: "Manage all customer appointments easily and never miss a booking." 
  },
  { 
    icon: <Users className="text-purple-600 size-10" />, 
    title: "Employee Management", 
    description: "Track employee clock-in/out with PINs and manage their schedules." 
  },
  { 
    icon: <ClipboardList className="text-orange-600 size-10" />, 
    title: "Client Management", 
    description: "Store client details, vehicle info, and history for easy access." 
  },
  { 
    icon: <PackageCheck className="text-red-600 size-10" />, 
    title: "Inventory Management", 
    description: "Monitor stock usage, get low-stock alerts, and manage supplies efficiently." 
  },
  { 
    icon: <FileText className="text-teal-600 size-10" />, 
    title: "Invoicing System", 
    description: "Automatically generate invoices for completed services and keep track of payments." 
  }
];

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Login Form */}
      
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Branding */}
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-bold text-2xl text-green-700">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="p-2  rounded-full"
            >
              <Cog className="size-10" />
            </motion.div>
            GarageSync
          </div>
        </div>
        
        {children}
      </div>

      <ScrollArea className="relative hidden  h-screen bg-gray-100 dark:bg-gray-900 lg:flex flex-col  p-10 w-full">
        {/* Branding - Name & Slogan */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-4 "
        >
         
          <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="p-2  rounded-full"
            >
              <Cog className="size-16 " color="green" />
            </motion.div>
           
       
          <h1 className="text-4xl font-bold text-green-700">GarageSync</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 italic">
            "Fix Cars, Not Spreadsheets!"
          </p>
        </motion.div>

        {/* Scrolling Feature Cards */}
        <div className=" flex flex-wrap gap-4  justify-center mt-4">
         
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .2, delay: index * 0.2 }}
                whileHover={{ scale: 1.2, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} 
                className="flex flex-col items-center bg-white w-[300px]  dark:bg-gray-800 shadow-lg rounded-lg p-4 text-center"
              >
                {feature.icon}
                <h3 className="font-semibold text-lg mt-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
      
        </div>
      </ScrollArea>
    </div>
  );
};

export default AuthLayout;
