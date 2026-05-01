import { getServerSession as getNextAuthServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        if (!user.verified) {
          throw new Error("Account is not verified");
        }

       
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
     
      if (user) {
        console.log("Setting JWT token with user:", user);
        token.id = user.id;
        token.role = user.role;
        token.verified = user.verified;
      }
      return token;
    },
    async session({ session, token }) {
     
      console.log("Setting session with token:", token);
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; 
        session.user.verified = token.verified;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  }
};

export const getServerSession = () => getNextAuthServerSession(authOptions);