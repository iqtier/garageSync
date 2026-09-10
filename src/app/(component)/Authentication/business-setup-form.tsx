"use client";
import { forwardRef, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MoveRight } from "lucide-react";
import "react-phone-number-input/style.css";

import * as RPNInput from "react-phone-number-input";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LocationSelector from "@/components/ui/location-input";

import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { createBusinessDetails } from "@/app/actions/settingActions";
import { useRouter } from "next/navigation";


import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { User } from "@/types/type";

const formSchema = z.object({
  businame: z.string().min(5, "Minimum 5 character"),
  phone: z.string(),
  email: z.string().email("provide a valid email address"),
  tax: z.string().refine(
    (value) => {
      const parsed = parseInt(value, 10);
      return !isNaN(parsed) && parsed >= 0;
    },
    { message: "must be a non-negative integer." }
  ),
  location: z.tuple([z.string(), z.string().optional()]),
  roadname: z.string(),
  postal: z.string(),
  city: z.string(),
  logo: z.instanceof(File, { message: "Please select an image file" }),
});

export default function BusinessSetup() {
  const { data: session, status, update } = useSession();
  useEffect(() => {
    if (status === 'loading' || !session) {
      update();
    }
  }, [session, status, update]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
 
  const user = session?.user as User

  const id = useId();

  const [preview, setPreview] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businame: "",
      phone: "",
      email: "",
      tax: "",
      roadname: "",
      city: "",
      postal: "",
      location: ["", ""],
    }
  });
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      startTransition(async () => {
        const result = await createBusinessDetails(values, user?.id as string);
        if (result?.status === "success") {
          toast.success(`Business setup completed`);
          
          form.reset();
          await update({
            ...session,
            user: { ...session?.user, business_Id: result.data.id },
          });
          router.push("/");
        } else {
          form.setError("root.serverError", {
            message: result?.error as string,
          });
          toast.error(`${result?.error}`);
        }
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl  mx-auto py-5 px-4"
        >
          <div className="flex flex-wrap gap-4 ">
            <div className=" flex-grow ">
              <FormField
                control={form.control}
                name="businame"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <div className="flex flex-row gap-1">
                        Business Name
                        <FormMessage className="text-red-500" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Business name"
                        type="text"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <div className="flex flex-row gap-1">
                        Phone number
                        <FormMessage />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <RPNInput.default
                        className="flex rounded-md shadow-sm bg-gray-50 dark:bg-gray-700"
                        international
                        inputComponent={PhoneInput}
                        id={id}
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={(newValue) => {
                          if (newValue) {
                            form.setValue(field.name, newValue.toString());
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-grow">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <div className="flex flex-row gap-1">
                        Email
                        <FormMessage className="text-red-500" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Business email"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FormLabel className="text-gray-700 dark:text-gray-200">
                    <div className="flex flex-row gap-1">
                      Country / State
                      <FormMessage className="text-red-500" />
                    </div>
                  </FormLabel>
                </FormLabel>
                <FormControl>
                  <LocationSelector
                    onCountryChange={(country) => {
                      setCountryName(country?.name || "");
                      form.setValue(field.name, [
                        country?.name || "",
                        stateName || "",
                      ]);
                    }}
                    onStateChange={(state) => {
                      setStateName(state?.name || "");
                      form.setValue(field.name, [
                        form.getValues(field.name)[0] || "",
                        state?.name || "",
                      ]);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="roadname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <div className="flex flex-row gap-1">
                        Street
                        <FormMessage className="text-red-500" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Road Name"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <FormLabel className="text-gray-700 dark:text-gray-200">
                        <div className="flex flex-row gap-1">
                          City
                          <FormMessage className="text-red-500" />
                        </div>
                      </FormLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        type="text"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <div className="flex flex-row gap-1">
                        Postal / Zip
                        <FormMessage className="text-red-500" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Postal / Zip code"
                        type="text"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Image Upload Field */}
          <div className="flex flex-wrap gap-4">
            <div className=" flex flex-col flex-grow ">
              <FormField
                control={form.control}
                name="logo"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <div className="flex flex-row gap-1">
                        Business Logo
                        <FormMessage className="text-red-500" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          onChange(file);
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setPreview(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {preview && (
                <div className="mt-4 ">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-40 rounded-2xl"
                  />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      <div className="flex flex-row gap-1">
                        Tax Rate {"(%)"}
                        <FormMessage className="text-red-500" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg.13% / 15%"
                        type="text"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full relative  text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isPending ? (
              <span className="absolute inset-0 flex justify-center items-center">
                <Spinner />
              </span>
            ) : (
              <>
                Finish Business Setup <MoveRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn(
          "-ms-px rounded-s-none shadow-none focus-visible:z-10",
          "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
