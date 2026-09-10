"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LogInSchema, UserSchema } from "@/types/type";
import { signIn, auth } from "@/lib/auth";
import { AuthError } from "next-auth";
import { ActionResult } from "@/types/type";
import { z } from "zod";

async function generateUniquePin(): Promise<string> {
  let pin: string = "";
  let isPinUnique = false;

  while (!isPinUnique) {
    pin = String(Math.floor(1000 + Math.random() * 9000)); // Generates a 4-digit number

    const existingUserWithPin = await prisma.user.findUnique({
      where: { pin },
    });

    if (!existingUserWithPin) {
      isPinUnique = true;
    }
  }
  return pin;
}

export async function registerUser(
  businesId: string | null | undefined,
  data: z.infer<typeof UserSchema>
): Promise<ActionResult<User>> {
  try {
    const { username, email, password, role } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { status: "error", error: "User Already exist" };
    }
    const pin = await generateUniquePin();
    const user = await prisma.user.create({
      data: {
        business_Id: businesId,
        name: username,
        email,
        password: hashedPassword,
        role,
        pin,
      },
    });
    return { status: "success", data: user };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}

export async function signInUser(
  data: z.infer<typeof LogInSchema>
): Promise<ActionResult<User> | undefined> {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
 
    return { status: "success", data: result };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid Credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    } else {
      return { status: "error", error: "Something else went wrong" };
    }
  }
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {

  
  return await prisma.user.findUnique({ where: { id },include:{business:true} });
}
