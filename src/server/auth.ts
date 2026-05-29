import {prisma} from "./db";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Session } from "inspector/promises";


export const  authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), 
  Session: 
  providers: [GitHub],
};