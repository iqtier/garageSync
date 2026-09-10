"use client";
import React from "react";
import CustomerForm from "./CustomerForm";
import { CustomerType } from "@/types/type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/app/actions/customerActions";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";

type Customers = CustomerType & { id: string };

const Clients: React.FC<{ isAdmin: boolean; customers: Customers[], business_id: string}> = ({
  isAdmin,
  customers,
  business_id
}) => {
  const router = useRouter();
    const [isPending, startTransition] = useTransition();


  const handleDeleteClick = async (id: string) => {
        startTransition(async() => {
            try {
                const result = await deleteCustomer(id);
                if (result.status === "success") {
                  toast.success("Customer deleted successfully");
                  router.refresh();
                } else {
                  toast.error("Failed to delete customer");
                }
              } catch (error) {
                toast.error("An error occurred while deleting the customer");
              }
        })
  };

  return (
    <div className="mt-5 space-y-4  animate-in fade-in slide-in-from-bottom-10">
      <CustomerForm isEdit={false} customerToEdit={null} fromBooking={false} />
      <Accordion type="single" collapsible className="w-full mt-5 gap-y-2">
        {customers.map((customer) => (
          <AccordionItem
            className="border rounded px-5 shadow-sm dark:bg-gray-800 dark:border-gray-700"
            key={customer.id}
            value={`item ${customer.id}`}
          >
            <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-white hover:no-underline flex items-center justify-between p-3">
              <div className="flex flex-col">
                 <h2 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{customer.email}</p>
              </div>
            </AccordionTrigger>

            {customer.vehicles?.map((vehicle, index) => (
              <AccordionContent key={index} className="text-gray-700 dark:text-gray-300">
                 <span className="font-medium"> {vehicle.make}</span> {vehicle.model} ({vehicle.year})
              </AccordionContent>
            ))}
              <AccordionContent className="flex flex-wrap sm:flex-row gap-2 mt-4">
                   <CustomerForm isEdit={true} customerToEdit={customer} fromBooking={false}/>
                     {isAdmin && (
                          <Button
                            variant={"destructive"}
                           onClick={() => handleDeleteClick(customer.id)}
                                 className="relative group"
                          >
                              {isPending ?  <span className="absolute inset-0 flex items-center justify-center">
                                 <Spinner/>
                                  </span> :
                                  (   <div className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4"/> Delete
                                    </div>)
                                 }
                         </Button>
                      )}

              </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Clients;