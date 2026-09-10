/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteService } from "@/app/actions/serviceActions";
import ServiceForm from "@/app/(component)/Services/service-form";
import { Service } from "@/types/type";

type ServicesAccordionProps = { services: Service[]; isAdmin: boolean };

const ServicesAccordion: React.FC<ServicesAccordionProps> = ({
  services,
  isAdmin,
}) => {
  const router = useRouter();

  const handleDeleteClick = async (id: number) => {
    try {
      const result = await deleteService(id); // Ensure this function exists and works as expected
      if (result.status === "success") {
        toast.success("Service deleted successfully");
        router.refresh(); // Refresh the page or handle the update to reflect changes
      } else {
        toast.error("Failed to delete Service");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the service");
    }
  };

  return (
    <div className="mt-5">
      {isAdmin && <ServiceForm isEdit={false} serviceToEdit={null} />}
      <Accordion type="single" collapsible className="w-full mt-5 gap-y-2">
        {services.map((service) => (
          <AccordionItem
            className="border rounded px-5 shadow-sm"
            key={service.id}
            value={`item ${service.id}`}
          >
            <AccordionTrigger className="text-lg hover:no-underline font-semibold">
              <h2 className="font-semibold">{service.name}</h2>
              <p>Price: ${service.price.toFixed(2)}</p>
            </AccordionTrigger>

            {service.fields?.map((field, index) => (
              <AccordionContent key={index}>
                <strong>{field.name}:</strong> {field.value}
              </AccordionContent>
            ))}
            {isAdmin && (
              <AccordionContent className="flex flex-row gap-x-2">
                <ServiceForm isEdit={true} serviceToEdit={service} />
                <Button
                  variant={"destructive"}
                  onClick={() => handleDeleteClick(service.id)}
                >
                  Delete
                </Button>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ServicesAccordion;
