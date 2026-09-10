"use client";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import AddNewCatagory from "./AddNewCatagory";

import { Category, inventorySchema, Supplier } from "@/types/type";

import { useRouter } from "next/navigation";
import { CreateInventory } from "@/app/actions/inventoryActions";
import { useUserStore } from "@/app/store/useUserStore";

type AddNewInventoryProps = {
  categories: Category[];
  businessId:string
};

const AddNewInventory: React.FC<AddNewInventoryProps> = ({ categories,businessId }) => {
  const router = useRouter();
  const {user} = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      fields: [], // Initialize fields as an empty array
    },
  });
  const { control, watch, handleSubmit, getValues } = form;
  const { fields, replace } = useFieldArray({
    control,
    name: "fields",
  });
  const watchedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (cat) => cat.id === watchedCategoryId
  );

  async function onSubmit(values: z.infer<typeof inventorySchema>) {
    try {
      const result = await CreateInventory(businessId as string,values);
      if (result?.status === "success") {
        toast.success(`Inventory successfully added`);
        form.reset();
        setIsDialogOpen(false);
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

  useEffect(() => {
    if (selectedCategory) {
      replace(
        selectedCategory.fields.map((fieldName) => ({
          name: fieldName,
          value: "",
        }))
      );
    } else {
      replace([]);
    }
  }, [selectedCategory, replace]);
  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="font-normal bg-cyan-600">
            <PackagePlus /> Add New Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add your inventory details here
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-1 max-w-3xl mx-auto py-5"
            >
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory Name </FormLabel>
                        <FormControl>
                          <Input placeholder="Name" type="text" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory SKU </FormLabel>
                        <FormControl>
                          <Input placeholder="SKU" type="text" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Brand" type="text" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-11">
                  <FormField
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Inventory Category </FormLabel>
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
                                  ? categories.find(
                                      (category) => category.id === field.value
                                    )?.name
                                  : "Select Category"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className=" p-0">
                            <Command>
                              <CommandInput placeholder="Search Category..." />
                              <CommandList>
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                  {categories.map((category) => (
                                    <CommandItem
                                      value={category.name}
                                      key={category.id}
                                      onSelect={() => {
                                        form.setValue(
                                          "categoryId",
                                          category.id
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          category.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {category.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1 mt-5">
                  <AddNewCatagory fromAddNewItemForm={true} businessId={businessId} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Container for dynamic fields */}
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                  >
                    {/* Responsive width */}
                    <FormField
                      control={control}
                      name={`fields.${index}.value`}
                      render={({ field: inputField }) => (
                        <FormItem>
                          <FormLabel>
                            {getValues(`fields.${index}.name`)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={getValues(`fields.${index}.name`)}
                              type="text"
                              {...inputField}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="reorder_point"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reorder Point</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Reorder Point"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="measure_of_unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesure Of Unit</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Measure of Unit"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="unit_cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Cost</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Unit Cost"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="retail_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retail Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Retail Price"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="storage_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Storage Location"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {selectedCategory?.compatibleVehicles && (
                <>
                  <p className="flex justify-center font-bold text-lg">
                    Enter compatible vehicle for your inventory
                  </p>
                  <div>
                    <FormField
                      control={control}
                      name="compatibleVehicles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compatible Vehicle</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="eg. 2020 Tyota Camery, Corolla, All Honda Civic 2016-2020 ... "
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            You can write all the compatibel vehcile make model
                            and year.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <DialogFooter>
                <Button className="w-full" type="submit">
                  Add Inventory
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInventory;
