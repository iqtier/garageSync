/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'

import { getUserById } from '@/app/actions/authActions'
import { auth } from '@/lib/auth';
import { User } from '@/types/type';

const  Page = async ({params}:{params:Promise<{user:string}>}) => {
  const userId = (await params).user
  const session = await auth()
  const currentUser = session?.user as User;
  const isUserAdmin = currentUser?.role === "admin";
  const user = await getUserById(userId) 
  return (
   
    <div>
      
      <p>User name : {user?.name}</p>
      <p>User email : {user?.email}</p>
      <p>User role : {user?.role}</p>
      <p>User Pin: {isUserAdmin? user?.pin:'****'}</p>
      <p>Busines : {user?.business?.name}</p>
      
    </div>
  )
}

export default Page
