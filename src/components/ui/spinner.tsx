"use client";
import React from "react";
import { Loader } from 'lucide-react';
export const Spinner = () => {
  return (
    <Loader size={50} color="#000"  className="animate-spin" />
  );
};
