/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Service, ServiceSchema, User } from "@/types/type";
import { createService, updateService } from "@/app/actions/serviceActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { useSession } from "next-auth/react";

type AddServiceFormProps = { isEdit: boolean; serviceToEdit: Service | null };

const ServiceForm: React.FC<AddServiceFormProps> = ({
  isEdit,
  serviceToEdit,
}) => {
  const {data:session} = useSession()

  const user = session?.user as User
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const addForm = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: { name: "", price: "" },
  });

  const editForm = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      ...serviceToEdit,
      price: serviceToEdit?.price.toString(),
    },
  });

  const form = isEdit ? editForm : addForm;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  async function onSubmit(data: z.infer<typeof ServiceSchema>) {
    let result;
    if (isEdit) {
      if (serviceToEdit?.id !== undefined) {
        result = await updateService(serviceToEdit?.id, data);
      }
    } else {
      result = await createService(user?.business_Id as string,data);
    }
    if (result?.status === "success") {
      toast.success(`Service successfully ${isEdit ? "updated" : "added"}`);
      router.refresh();
      setIsSheetOpen(false);
      form.reset();
    } else {
      form.setError("root.serverError", { message: result?.error as string });
      toast.error(`${result?.error}`);
    }
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="" onClick={() => setIsSheetOpen(true)}>
          {isEdit ? "Edit" : "Add Service"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Service" : "Add Service"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Edit your service details here."
              : "Add your service here. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 space-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Service name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-row justify-center items-center gap-x-2 w-full"
              >
                <FormField
                  control={form.control}
                  name={`fields.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Field Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fields.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-8"
                  onClick={() => remove(index)}
                >
                  <Trash2 className=" text-red-600" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => append({ name: "", value: "" })}
            >
              Add Field
            </Button>

            <SheetFooter>
              <Button className="w-full font-bold" type="submit">
                {isEdit ? "Update " : "ADD "}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ServiceForm;
