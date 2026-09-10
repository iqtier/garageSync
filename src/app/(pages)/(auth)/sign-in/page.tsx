
import { LoginForm } from "@/app/(component)/Authentication/login-form";
import React from "react";




const SignIn = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignIn;
