import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail, getUserById } from "@/app/actions/authActions";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        try {
          user = await getUserByEmail(credentials?.email as string);
          if (
            !user ||
            !(await compare(credentials?.password as string, user.password))
          ) {
            return null;
          }
          return user;
        } catch (error) {
          console.error("Authentication error", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger,session }) {
      if(trigger === "update") {
        return {...token, ...session.user}
      }
      if (user) {
       
        const dbUser = await getUserById(user.id as string);
        return {
          ...token,
          id: dbUser?.id || null,
          name: dbUser?.name || null,
          email: dbUser?.email || null,
          role: dbUser?.role || null,
          business_Id: dbUser?.business_Id || null,
          userExists: !!dbUser, // Convert to boolean
        };
      }

      // **🔹 Force-check user existence on every request**
      if (token?.id) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/check-user?id=${token.id}`);
        const data = await response.json();
        const userExists = data.exists;
        if (!userExists) {
          return null; // Log out the user
        }
        return { ...token, userExists };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const typedUser = session.user as unknown as {
          id: string;
          name: string;
          email: string;
          role: string;
          business_Id: string;
          userExists: boolean;
        };

        typedUser.id = token.id as string;
        typedUser.name = token.name as string;
        typedUser.email = token.email as string;
        typedUser.role = token.role as string;
        typedUser.business_Id = token.business_Id as string;
        typedUser.userExists = token.userExists as boolean;
      }
      return session;
    },
  },
});
