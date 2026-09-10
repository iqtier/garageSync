

import { z } from "zod";

export const LogInSchema = z.object({
  email: z
    .string()
    .min(1, "Email Required")
    .email("Please provide a valid email"),
  password: z.string().min(1, "Password required").min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const UserSchema = z.object({
  username: z
    .string()
    .min(1, "Username Required")
    .min(3, "Username must be more than 3 character")
    .max(15, "User name must be under 15 Character"),
  email: z
    .string()
    .min(1, "Email Required")
    .email("Please provide a valid email"),
  password: z.string().min(1, "Password required").min(8, {
    message: "Password must be at least 8 characters",
  }),
  role: z.string().min(1, "Role is required"),
});

export const ServiceSchema = z.object({
  name: z.string().min(1, "Please Provide a service name."),
  price: z.string().min(1, "Please provide a unit price"),
  fields: z.array(
    z.object({
      name: z.string().min(1, "Provide a field name"),
      value: z.string().min(1, "Please provide a value"),
    })
  ),
});

export const BookingSchema = z.object({
  date: z.date({
    required_error: "A date of Appointment is required.",
  }),
  time: z.string().min(1, "Please select a time slot."),
  customer_id: z.string().min(1, "Please Select a customer"),
  vehicle_id: z.string().min(1, "Please Select a car"),
  type: z.string(),
  ramp: z.string(),
  status: z
    .enum(["pending", "ongoing", "completed", "cancelled"])
    .default("pending"),
  notes: z.string().optional(),
  technician_ids: z.array(z.string()).optional(),
  payment_status: z.enum(["pending", "paid", "unpaid"]).default("pending"),
  payment_method: z.enum(["cash", "credit_card", "paypal"]).optional(),
  services_id_qty: z.array(
    z.object({
      id: z.string().min(1, "Provide a service"),
      qty: z.string().min(1, "Please provide a quantity"),
    })
  ),
});

export const CustomerSchema = z.object({
  name: z.string().min(1, "Name Required"),
  email: z
    .string()
    .min(1, "Email Required")
    .email("Please Provide a valid email"),
  phone: z.string().min(1, "Phone Number Required"),
  taxExempt: z.boolean().default(false),
  discounted: z.boolean().default(false),
  discountRate: z.number().default(0),
  discountType: z.union([z.string(), z.null()]).default(null),
  isChargeAccount: z.boolean().default(false),
  vehicles: z
    .array(
      z.object({
        make: z.string().min(1, "Make Required"),
        model: z.string().min(1, "Model Required"),
        year: z.string().min(1, "Year Required"),
      })
    )
    .optional(),
});

export const inventoryReceivingSchema = z.object({
  inventory: z.string().min(1),
  quantity: z.string().min(1),
  cost: z.string().optional(),
  supplier: z.string(),
  reference_number: z.string(),
  notes: z.string().optional(),
});
export const supplierSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  address: z.string().optional(),
});

export const inventorySchema = z.object({
  name: z.string().min(1),
  sku: z.string().default("Not Provided"),
  brand: z.string().default("Not Provided"),
  categoryId: z.number().min(1),
  quantityOnHand: z.string().default("0"),
  unit_cost: z.string().min(1),
  retail_price: z.string().min(1),
  measure_of_unit: z.string(),
  reorder_point: z.string().min(1),
  storage_location: z.string().min(1),
  compatibleVehicles: z.string().default("Not Applicable"),
  fields: z.array(
    z.object({
      name: z.string().min(1),
      value: z.string().min(1),
    })
  ),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  fields: z.array(
    z.object({
      name: z.string(),
    })
  ),
  compatibleVehicles: z.boolean().default(false),
});

export type CustomerType = z.infer<typeof CustomerSchema>;

export type Employee = {
  id:string
  username: string;
  email: string;
  role: string;
};

export type ServiceType = z.infer<typeof ServiceSchema>;

export type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export type Service = {
  id: number;
  name: string;
  price: number;
  fields: ServiceFields[];
};
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
  business_Id: string | null | undefined;
  bookings: {
    id: number;
    bookingId: number;
    technicianId: string;
  }[];
  ClockInOut: {
    id: string;
    userId: string;
    clockIn: Date;
    clockOut: Date | null;
    hoursWorked: number | null;
    createdAt: Date;
  }[];
};
type ServiceFields = {
  id: number;
  serviceId: number;
  name: string;
  value: string;
};
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
};
type Vehicle = {
  id: number;
  make: string;
  model: string;
  year: string;
  customerId: string;
};
type ServiceIdQty = {
  id: string;
  bookingId: number;
  qty: string;
  serviceId: number;
  service: Service;
};

export type Booking = {
  id: number;
  date: Date;
  start:Date | null;
  finish: Date|null;
  time: string;
  ramp: string | null;
  vehicle_id?: number | null;
  booking_type?: string | null;
  status: string;
  note: string;
  payment_status: string;
  payment_method: string;
  customerid: string;
  services: ServiceIdQty[];
  technicians: BookingTechnician[];
  vehicle?: Vehicle | null;
  customer: Customer;
  UsedInventory: UsedInventoryType[];
};
type BookingTechnician = {
  id: number;
  bookingId: number;
  technicianId: string;
  technician: User;
};

export type Supplier = {
  id: number;
  name: string;
  contactId: number;
};
export type Category = {
  id: number;
  name: string;
  description: string;
  fields: string[];
  compatibleVehicles: boolean;
};

export const EmployeeScheduleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  date: z.date({
    required_error: "A date is required.",
  }),
  status: z.enum(["on", "off", "sick", "vacation", "available for on call"]),
});

export type EmployeeScheduleType = z.infer<typeof EmployeeScheduleSchema>;

// types/type.ts

export interface InventoryTransactionType {
  id: number;
  date: Date;
  supplier: SupplierType;
  supplierId: number;
  type: string; // e.g., "receipt", "sale", "adjustment"
  inventoryId: number;
  inventory: InventoryType;
  quantity: number;
  referenceNumber?: string | null;
  cost?: number | null;
  notes?: string | null;
}

export interface UsedInventoryType {
  id: number;
  inventoryId: number;
  inventory: InventoryType;
  bookingId: number;
  quantity: number;
  transactionType: string;
  includedWithService: boolean;
}

export interface InventoryType {
  id: number;
  sku?: string | null;
  name: string;
  brand?: string | null;
  categoryId: number;
  quantityOnHand: number;
  unitCost: number;
  retailPrice: number;
  measure_of_unit: string;
  reorderPoint?: number | null;
  location?: string | null;
  compatibleVehicles: string;
  InventoryFields:InventoryFieldsType[]
}

export interface InventoryFieldsType {
  id: number;
  name: string;
  value: string;
  inventoryId: number;
  
}

export interface CategoryType {
  id: number;
  name: string;
  description: string;
  fields: string[];
  compatibleVehicles: boolean;
}

export interface SupplierType {
  id: number;
  name: string;
  contact: ContactType;
  contactId: number;
}

export interface ContactType {
  id: number;
  phone: string;
  email: string;
  address?: string | null;
  supplier?: SupplierType | null;
}

export type BusinessType = {
  location: [string, string | undefined];
  businame: string;
  email: string;
  tax: string;
  phone: string;
  roadname: string;
  city: string;
  postal: string;
  logo: File;
};