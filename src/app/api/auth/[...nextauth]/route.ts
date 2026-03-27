import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "@/lib/email";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;
        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // ✅ Detect instructor login
        const isInstructorLogin =
          (req as any)?.body?.isInstructorLogin === "true" ||
          (req as any)?.body?.isInstructorLogin === true;

        if (isInstructorLogin && user.role !== "instructor") {
          return null; // ❌ BLOCK
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
        userId: token.id as string,
      };
    },
    async signIn({ user, account }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        // ✅ CREATE USER automatically for Google signup
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            emailVerified: new Date(), // Google already verified
            role: "user",
          },
        });

        user.id = newUser.id;
        user.role = newUser.role;

        await sendWelcomeEmail(newUser.email);

        return true;
      }

      if (!existingUser.emailVerified) {
        throw new Error("Please verify your email first.");
      }

      // ✅ send welcome email for BOTH google + credentials
      if (!existingUser.hasReceivedWelcomeEmail) {
        await sendWelcomeEmail(existingUser.email);

        await prisma.user.update({
          where: { id: existingUser.id },
          data: { hasReceivedWelcomeEmail: true },
        });
      }

      user.id = existingUser.id;
      user.role = existingUser.role;

      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
