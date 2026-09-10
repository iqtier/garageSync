"use server";

import { ActionResult, BusinessType } from "@/types/type";
import { Business } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createBusinessDetails(
  data: BusinessType,
  userId: string
): Promise<ActionResult<Business>> {
  const { businame, phone,email, tax, location,city, roadname, postal, logo } = data;
  console.log(userId);
  try {
    const buffer = await logo.arrayBuffer();
    const imageBinary = Buffer.from(buffer);
    const business = await prisma.business.create({
      data: {
        name: businame,
        phone,
        taxRate:parseInt(tax)/100,
        email:email,
        address: {
          country: location[0],
          state: location[1],
          city: city,
          roadname: roadname,
          postal: postal,
        },
        logo: imageBinary, // Store binary data
        users: {
          connect: { id: userId },
        },
      },
    });

    return { status: "success", data: business };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: "error", error: error as string };
  }
}

export async function getBusinessById(businessId: string) {
  console.log("looking for business form login",businessId);
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    
  });
  return business;
}