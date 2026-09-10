import { SignUpForm } from '@/app/(component)/Authentication/signup-form'
import React from 'react'

const page = () => {
  return (
   <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <SignUpForm />
        </div>
      </div>
  )
}

export default page