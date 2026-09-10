/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CustomerSchema, CustomerType, User } from "@/types/type";
import { createCustomer, updateCustomer } from "@/app/actions/customerActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import { useSession } from "next-auth/react";


type Customer = CustomerType & { id: string };
type CustomerFormProps = {
  isEdit: boolean;
  customerToEdit: Customer | null;
  fromBooking: boolean;
};
const CustomerForm: React.FC<CustomerFormProps> = ({
  isEdit,
  customerToEdit,
  fromBooking,
}) => {
  const { data: session, status, update } = useSession();
    useEffect(() => {
      if (status === 'loading' || !session) {
        update();
      }
    }, [session, status, update]);
  const user = session?.user as User
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addForm = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      taxExempt: false,
      discounted: false,
      discountType: "",
      discountRate: 0,
      vehicles: [],
    },
  });

  const editForm = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: customerToEdit?.name,
      email: customerToEdit?.email,
      phone: customerToEdit?.phone,
      taxExempt: customerToEdit?.taxExempt,
      discounted: customerToEdit?.discounted,
      discountType: customerToEdit?.discountType,
      discountRate: customerToEdit?.discountRate,
      ...customerToEdit,
    },
  });
  const form = isEdit ? editForm : addForm;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  async function onSubmit(data: CustomerType) {

    let result;
    if (isEdit) {
      if (customerToEdit?.id !== undefined) {
        result = await updateCustomer(customerToEdit?.id, data);
      }
    } else {
      result = await createCustomer(data, user.business_Id as string);
      
    }

    if (result?.status === "success") {
      toast.success(`Customer successfully ${isEdit ? "updated" : "added"}}`);
      router.refresh();
      setIsDialogOpen(false);
      form.reset();
    } else {
      form.setError("root.serverError", { message: result?.error as string });
      toast.error(`${result?.error}`);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-white"
          variant="default"
          onClick={() => setIsDialogOpen(true)}
        >
          {isEdit ? (
            "Edit"
          ) : fromBooking ? (
            <UserPlus />
          ) : (
            <div className="flex flex-row gap-x-2  justify-center items-center">
              <UserPlus /> Add Cusotmer
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white animate-in fade-in slide-in-from-bottom-10">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit your customer details here."
              : "Add your customer here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 space-y-3"
          >
            <div className="flex flex-row justify-between items-center gap-x-2 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone Number"
                        {...field}
                        className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <FormField
                control={form.control}
                name="taxExempt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-x-4 dark:border-gray-700 justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Tax Exempt</FormLabel>
                      <FormDescription>
                        Is this customer is exempt form paying Tax?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        className={` text-gray-900 dark:text-gray-400  bg-gray-200  ${field.value ===true ?"dark:bg-green-500":"dark:bg-gray-600" } `}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isChargeAccount"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-x-4 dark:border-gray-700 justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Charge Account</FormLabel>
                      <FormDescription>
                        Is this customer has a charge account?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        className={` text-gray-900 dark:text-gray-400  bg-gray-200  ${field.value ===true ?"dark:bg-green-500":"dark:bg-gray-600" } `}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg border">
              <FormField
                control={form.control}
                name="discounted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between dark:border-gray-700 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Apply Discount</FormLabel>
                      <FormDescription>
                        Is this customer is get any discount?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        className=  {` text-gray-900 dark:text-gray-400  bg-gray-200  ${field.value ===true ?"dark:bg-green-500":"dark:bg-gray-600" } `}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("discounted") && (
                <>
                  <div className="flex flex-wrap gap-x-2 p-2">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[150px]">
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? undefined}
                            required={form.watch("discounted")}
                          >
                            <FormControl>
                              <SelectTrigger className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600">
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-gray-900 dark:border-gray-200 dark:text-white">
                              <SelectItem value="flat_amount">
                                Flat Amount
                              </SelectItem>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountRate"
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[150px]">
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Discount Value"
                              type="number"
                              {...field}
                              onChange={(e) => {
                                const parsedValue = parseFloat(e.target.value);
                                form.setValue(
                                  field.name,
                                  isNaN(parsedValue) ? 0 : parsedValue
                                );
                              }}
                              required={form.watch("discounted")}
                              className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Vehicles
            </h3>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap justify-center items-center gap-x-2 "
              >
                <FormField
                  control={form.control}
                  name={`vehicles.${index}.make`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Make"
                          {...field}
                          className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`vehicles.${index}.model`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Model" {...field} className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`vehicles.${index}.year`}
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="Year" {...field} className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"/>
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
              onClick={() => append({ make: "", model: "", year: "" })}
            >
              <div className="flex items-center gap-2">
                             <Plus className="h-4 w-4"/> Add Vehicle
                       </div>
            </Button>

            <DialogFooter>
              <Button className="w-full relative" type="submit">
              {isPending ?  <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner/>
                  </span> : (isEdit ? "Update" : "ADD")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;
