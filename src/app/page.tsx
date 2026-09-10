"use server"

import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { User } from "@/types/type";
import { getUserById } from "./actions/authActions";
export default async function Home() {
  const session = await auth();
  const currentUser = session?.user as User;
  
  // If no session, redirect to sign-in
 
  if (!session?.user || !currentUser.id) {
    return redirect('/sign-in');
  }

  

  // Fetch user from database to get the latest business_Id
  const user = await getUserById(currentUser.id);
 
  // Check if user exists in database. Redirect to sign-in if they don't
  if (!user) {
    return redirect('/sign-in');
  }

  // Update the session with the latest business_Id
  (session.user as User).business_Id = user.business_Id;

  const businessId = user.business_Id;

  if (businessId) {
    return redirect(`/home`);
  } else {
    return redirect("/setup-businesss");
  }
}

