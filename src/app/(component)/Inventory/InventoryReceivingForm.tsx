"use client";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { inventoryReceivingSchema, User } from "@/types/type";
import { useState } from "react";
import {
  getInventoryNameAndId,
  getSupplierNameAndId,
  ReceiveInventory,
} from "@/app/actions/inventoryActions";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const InventoryReceivingForm:React.FC<{businessId:string}> = ({businessId}) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const isUserAdmin = user?.role === "admin";
  const router = useRouter();
  const [inventories, setInventories] = useState<
    { id: number; name: string }[] | null
  >(null);
  const [suppliers, setSuppliers] = useState<
    { id: number; name: string }[] | null
  >(null);
  useEffect(() => {
    const getInventoriesAndSuppliers = async () => {
      try {
        const inventory = await getInventoryNameAndId(businessId);
        setInventories(inventory);
        const suppliers = await getSupplierNameAndId(businessId);
        setSuppliers(suppliers);
      } catch (error) {
        throw error;
      }
    };
    getInventoriesAndSuppliers();
  }, []);

  const form = useForm<z.infer<typeof inventoryReceivingSchema>>({
    resolver: zodResolver(inventoryReceivingSchema),
    defaultValues: {
      quantity: "",
      cost: "",
      reference_number: "",
    },
  });
  async function onSubmit(data: z.infer<typeof inventoryReceivingSchema>) {
    try {
      const result = await ReceiveInventory(data);
      if (result?.status === "success") {
        toast.success("Inventory successfully received");
        form.reset();
        router.refresh();
      } else {
        form.setError("root.serverError", { message: result?.error as string });
        toast.error(`${result?.error}`);
      }
    } catch (error) {
      toast.error(
        ("Failed to submit the form. Please try again." + error) as string
      );
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-3xl mx-auto py-5"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Inventory</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              " justify-between",
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
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput placeholder="Search Inventory..." />
                          <CommandList>
                            <CommandEmpty>No Inventory found.</CommandEmpty>
                            <CommandGroup>
                              {inventories?.map((inventory) => (
                                <CommandItem
                                  value={inventory.name}
                                  key={inventory.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "inventory",
                                      inventory.id.toString()
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      inventory.id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {inventory.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select Inventory that you are receiving
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Supplier</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              " justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? suppliers?.find(
                                  (supplier) =>
                                    supplier.id.toString() === field.value
                                )?.name
                              : "Select Supplier"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput placeholder="Search supplier..." />
                          <CommandList>
                            <CommandEmpty>No supplier found.</CommandEmpty>
                            <CommandGroup>
                              {suppliers?.map((supplier) => (
                                <CommandItem
                                  value={supplier.name}
                                  key={supplier.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "supplier",
                                      supplier.id.toString()
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      supplier.id.toString() === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {supplier.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select Inventory that you are receiving
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="Quantity" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter quantity you are receiving
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input placeholder="Cost" {...field} />
                    </FormControl>
                    <FormDescription>
                      Cost per unit (if different than previous cost)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="reference_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Reference number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter Reference number of Invoice number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Note" {...field} />
                </FormControl>
                <FormDescription>
                  Enter any notes about the transaction
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center items-center">
            <Button disabled={!isUserAdmin} type="submit" className="w-2/3">
              Receive Inventory
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InventoryReceivingForm;
