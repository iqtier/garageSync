import Clients from '@/app/(component)/Customer/Customer'
import { getUserByEmail } from '@/app/actions/authActions';
import { getAllCustomer } from '@/app/actions/customerActions';
import { auth } from '@/lib/auth';
import { User } from '@/types/type';
import React from 'react'

const page = async () => {
  const session = await auth();
  const user = session?.user as User;
  const isAdmin = user?.role === "admin";
  const customers = await getAllCustomer(user?.business_Id as string);
  return (
    <div className='space-y-4 animate-in fade-in slide-in-from-bottom-10'>
 

    <Clients isAdmin={isAdmin} customers = {customers} business_id={user?.business_Id as string}/>

    
  </div>
  )
}

export default page