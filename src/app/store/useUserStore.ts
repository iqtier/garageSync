import { JsonValue } from "@prisma/client/runtime/library";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface Business {
  id: string;
  name: string;
  phone: string;
  address: JsonValue;
  taxRate: number;
  logo: string // Convert `Bytes` to Base64 for easy handling
  created_at: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  business_Id: string | null | undefined;
}

interface UserStore {
  user: User | null;
  business: Business | null;
  setUser: (user: User) => void;
  setBusiness: (business: Business) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      business: null,
      setUser: (user) => set({ user }),
      setBusiness: (business) => set({ business }),
      clearUser: () => set({ user: null, business: null }),
    }),
    {
      name: "user-storage", // Storage key in localStorage
    }
  )
);