"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BookmarkPlus, PackagePlus, Trash2 } from "lucide-react";

import { useFieldArray, useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { categorySchema } from "@/types/type";
import { CreateCategory } from "@/app/actions/inventoryActions";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

type CategoryFormProps = {
  fromAddNewItemForm: boolean;
  businessId: string;
};
const AddNewCatagory: React.FC<CategoryFormProps> = ({
  fromAddNewItemForm,
  businessId
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });
  async function onSubmit(values: z.infer<typeof categorySchema>) {
    try {
      const result = await CreateCategory(values,businessId);
      if (result?.status === "success") {
        toast.success(`Category successfully added`);
        form.reset();
        setIsDialogOpen(false);
        router.refresh();
      } else {
        form.setError("root.serverError", { message: result?.error as string });
        toast.error(`${result?.error}`);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <BookmarkPlus /> {fromAddNewItemForm ? "" : "Add Catagory"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Catagory</DialogTitle>
            <DialogDescription>
              Add name and description of the new Category
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 py-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      write your inventory category name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Description of your category
                    </FormDescription>
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
                        <FormControl>
                          <Input placeholder="Field Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className=" text-red-600" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                className=" text-purple-600 font-bold"
                onClick={() => append({ name: "" })}
              >
                <PackagePlus /> Add Category Fields
              </Button>

              <FormField
                control={form.control}
                name="compatibleVehicles"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between  rounded-lg border p-4">
                    <div className="space-y-0.5 mr-3">
                      <FormLabel>Compatible Vehicles</FormLabel>
                      <FormDescription>
                        Do you want to show input fields for compatible vehicle
                        for this inventory Category?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                   
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button className="w-full" type="submit">
                  Add Category
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
};

export default AddNewCatagory;
