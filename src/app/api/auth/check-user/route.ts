import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import your Prisma client

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) return NextResponse.json({ exists: false });

    const user = await prisma.user.findUnique({
      where: { id },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ exists: false });
  }
}
