"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult, CustomerType } from "@/types/type";
import { Customer } from "@prisma/client";

export async function createCustomer(
  data: CustomerType,
  businesId : string
): Promise<ActionResult<Customer>> {
  try {
    const customer = await prisma.customer.create({
      data: {
        business_Id: businesId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        taxExempt: data.taxExempt,
        discounted: data.discounted,
        discountType: data.discountType,
        discountRate: data.discountRate,
        vehicles: {
          create: data.vehicles?.map((vehicle) => ({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
          })),
        },
      },
    });
    return { status: "success", data: customer };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: "error", error: error as string };
  }
}

export async function updateCustomer(
  customerId: string,
  data: CustomerType
): Promise<ActionResult<Customer>> {
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        isChargeAccount: data.isChargeAccount,
        discounted: data.discounted,
        discountRate: data.discounted ? data.discountRate : 0,
        discountType: data.discounted ? data.discountType : null,
        vehicles: {
          deleteMany: {},
          create: data.vehicles?.map((vehicle) => ({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
          })),
        },
      },
    });
    return { status: "success", data: updatedCustomer };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}
export async function getAllCustomer(businesId: string) {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        business_Id: businesId,
      },
      include: { vehicles: true },
    });
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

export async function deleteCustomer(
  id: string
): Promise<ActionResult<Customer>> {
  try {
    const deleteCustomer = await prisma.customer.delete({
      where: { id: id },
    });

    return { status: "success", data: deleteCustomer };
  } catch (error) {
    console.log(error);
    return { status: "error", error: error as string };
  }
}
