"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getTechnicians } from "@/app/actions/employeeActions";
import { getBooking, updateBooking } from "@/app/actions/bookingActions";
import { User } from "@/types/type";

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";

import { getInventoryNameAndId } from "@/app/actions/inventoryActions";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { useSession } from "next-auth/react";

const bookingSchema = z.object({
  status: z.string(),
  note: z.string().optional(),
  payment_status: z.string(),
  payment_method: z.string(),
  technician_ids: z.array(z.string()).optional(),
  inventories: z
    .array(
      z.object({
        id: z.string().min(1, "Must Select a item"),
        qty: z.string().min(1, "Enter a valid quantity"),
        included: z.boolean().default(false),
      })
    )
    .optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;
type Inventory = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
};
const EditBookingForm: React.FC<{
  booking_id: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ booking_id, setIsOpen }) => {
  const [technicians, setTechnicians] = useState<User[] | null>(null);
  const [inventories, setInventories] = useState<Inventory[] | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as User;
    const businessId = user.business_Id;
  useEffect(() => {
    const get_technicians = async () => {
      try {
        const technicians = await getTechnicians(businessId as string);
        setTechnicians(technicians);
      } catch (error: any) {
        setError(error.message);
      }
    };
    const get_inventors = async () => {
      try {
        const inventors = await getInventoryNameAndId(businessId as string);
        setInventories(inventors);
      } catch (error: any) {
        setError(error.message);
      }
    };
    const get_booking = async () => {
      try {
        const booking = await getBooking(booking_id);

        form.reset({
          status: booking?.status || "",
          note: booking?.note || "",
          payment_method: booking?.payment_method || "",
          payment_status: booking?.payment_status || "",
          technician_ids: booking?.technicians.map((t) => t.technicianId) || [],
          inventories:
            booking?.UsedInventory?.map((inv) => ({
              id: inv.inventoryId.toString(),
              qty: inv.quantity.toString(),
              included: Boolean(inv.includedWithService),
            })) || [],
        });
        if (booking) {
          setIsPaid(booking.payment_status === "paid");
          setIsCompleted(booking.status === "completed");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    get_inventors();
    get_technicians();
    get_booking();
  }, [booking_id]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: "",
      note: "",
      payment_method: "",
      payment_status: "",
      technician_ids: [],
      inventories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventories",
  });

  async function onSubmit(data: BookingFormValues) {
    startTransition(async () => {
      const result = await updateBooking(booking_id, data);
      if (result?.status === "success") {
        toast.success(`Appointment successfully updated`);
        router.refresh();
        setIsOpen(false);
        form.reset();
      } else {
        form.setError("root.serverError", { message: result?.error as string });
        toast.error(`${result?.error}`);
      }
    });
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-2">
          <div className="grid  sm:grid-cols-12 gap-2">
            <div className="sm:col-span-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          disabled={isCompleted}
                          className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        >
                          <SelectValue>
                            {field.value
                              ? field.value.toUpperCase()
                              : "Select your status"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-4">
              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Payment Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          disabled={isPaid}
                          className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        >
                          <SelectValue>
                            {field.value
                              ? field.value.toUpperCase()
                              : "Select Payment Status"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="charge">Charge</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-4">
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">
                      Payment Method
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600">
                          <SelectValue>
                            {field.value
                              ? field.value.toUpperCase()
                              : "Select Payment method"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="debit">Debit</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                        <SelectItem value="interac">Interac</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid  sm:grid-cols-12 gap-2">
            <div className="sm:col-span-6">
              <FormField
                control={form.control}
                name="technician_ids"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                      Technicians
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isCompleted}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600",
                              !field.value || field.value.length === 0
                                ? "text-muted-foreground"
                                : ""
                            )}
                          >
                            {field.value && field.value.length > 0
                              ? technicians
                                  ?.filter((technician) =>
                                    field.value?.includes(technician.id)
                                  )
                                  .map((technician) => technician.name)
                                  .join(", ")
                              : "Select technicians"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <Command>
                          <CommandInput
                            placeholder="Search technicians..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No technician found.</CommandEmpty>
                            <CommandGroup>
                              {technicians?.map((technician) => (
                                <CommandItem
                                  value={technician.id}
                                  key={technician.id}
                                  onSelect={() => {
                                    const selectedTechnicianIds = (
                                      field.value || []
                                    ).includes(technician.id)
                                      ? (field.value || []).filter(
                                          (id) => id !== technician.id
                                        )
                                      : [...(field.value || []), technician.id];
                                    form.setValue(
                                      "technician_ids",
                                      selectedTechnicianIds
                                    );
                                  }}
                                >
                                  {technician.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      (field.value || []).includes(
                                        technician.id
                                      )
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />
          <div className="flex flex-col gap-y-2">
            <h2 className="text-lg font-semibold">Inventories</h2>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap items-center space-x-3 space-y-0 rounded-md border dark:border-gray-700 p-1"
              >
                <FormField
                  control={form.control}
                  name={`inventories.${index}.id`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-3">
                      <FormLabel>Inventory</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={isCompleted}
                              variant="outline"
                              role="combobox"
                              className={cn(
                                " justify-between text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? inventories?.find(
                                    (inventory) =>
                                      inventory.id.toString() === field.value
                                  )?.name
                                : "Select Inventory"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className=" p-0 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                          <Command>
                            <CommandInput placeholder="Search Inventory..." />
                            <CommandList>
                              <CommandEmpty>No Inventory found.</CommandEmpty>
                              <CommandGroup>
                                {inventories?.map((inventory) => (
                                  <CommandItem
                                    value={inventory.id.toString()}
                                    key={inventory.id}
                                    onSelect={() => {
                                      if (inventory.quantity > 0) {
                                        form.setValue(
                                          `inventories.${index}.id`,
                                          inventory.id.toString()
                                        );
                                      }
                                    }}
                                    className={cn(
                                      "flex items-center justify-between cursor-pointer",
                                      inventory.quantity <= 0 &&
                                        "cursor-not-allowed"
                                    )}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        inventory.id.toString() === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <span
                                      className={`${
                                        inventory.quantity <= 0
                                          ? "text-red-500"
                                          : ""
                                      }`}
                                    >{`${inventory.name} - ${inventory.quantity} ${inventory.unit}`}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`inventories.${index}.qty`}
                  rules={{
                    required: "Quantity is required",
                    validate: (value) => {
                      const numericValue = parseFloat(value);
                      const selectedInventory = inventories?.find(
                        (inventory) =>
                          inventory.id.toString() ===
                          form.watch(`inventories.${index}.id`)
                      );

                      if (isNaN(numericValue))
                        return "Please enter a valid number";
                      if (numericValue <= 0)
                        return "Quantity must be greater than 0";
                      if (
                        selectedInventory &&
                        numericValue > selectedInventory.quantity
                      )
                        return `Max available quantity: ${selectedInventory.quantity}`;

                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => {
                    const selectedInventory = inventories?.find(
                      (inventory) =>
                        inventory.id.toString() ===
                        form.watch(`inventories.${index}.id`)
                    );

                    return (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isCompleted}
                            placeholder="Quantity"
                            {...field}
                            className="text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                            onChange={(e) => {
                              let value = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              ); // Allow only numbers & decimal
                              const numericValue = parseFloat(value);

                              if (
                                selectedInventory &&
                                numericValue > selectedInventory.quantity
                              ) {
                                field.onChange(
                                  selectedInventory.quantity.toString()
                                );
                              } else {
                                field.onChange(value);
                              }
                            }}
                            onBlur={(e) => {
                              let value = e.target.value.trim();
                              const numericValue = parseFloat(value);

                              if (isNaN(numericValue) || numericValue <= 0) {
                                field.onChange(""); // Clear input if invalid
                              }
                            }}
                          />
                        </FormControl>
                        {fieldState.error && (
                          <p className="text-red-500 text-sm">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    );
                  }}
                />

                <div className="flex flex-row place-items-baseline space-x-1 ">
                  <FormField
                    control={form.control}
                    name={`inventories.${index}.included`}
                    render={({ field }) => {
                      console.log("field.value:", field.value);
                      return (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 ">
                          <FormControl>
                            <Checkbox
                              disabled={isCompleted}
                              checked={field.value === true}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                            />
                          </FormControl>
                          <FormLabel>Included in service</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                  <Button
                    disabled={isCompleted}
                    type="button"
                    variant="destructive"
                    className="mt-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              disabled={isCompleted}
              onClick={() => append({ id: "", qty: "", included: false })}
            >
              Add Inventory
            </Button>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-white">
                  Note
                </FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="Notes"
                    className="resize-none  text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="relative w-full"
            disabled={isCompleted && isPaid}
          >
            {isPending ? (
              <span className="absolute inset-0 flex items-center gap-x-4 justify-center">
                <Spinner /> Updating...
              </span>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditBookingForm;
