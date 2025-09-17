import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";


declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      role: {
        name: string;
        metaCode: string;
      };
    };
  }

  interface User {
    id: number;
    email: string;
    role: {
      name: string;
      metaCode: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    role: {
      name: string;
      metaCode: string;
    };
  }
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              hashedPassword: true,
              role: {
                select: {
                  name: true,
                  metaCode: true,
                },
              },
              recruiter: {
                select: {
                  hospital: {
                    select: {
                      activeStatus: true,
                      name: true,
                    },
                  },
                },
              },
            },
          });

          if (!user || !user.hashedPassword) {
            return null;
          }

          
          const roleMetaCode = user.role.metaCode.toUpperCase();
          const isRecruiterRole = roleMetaCode === 'RECRUITER' || roleMetaCode === 'LEAD_RECRUITER';
          
          if (isRecruiterRole && user.recruiter && user.recruiter.length > 0 && !user.recruiter[0].hospital.activeStatus) {
            throw new Error('Hospital deactivated. Please contact system manager.');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword,
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 1, 
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,

 
  debug: process.env.NODE_ENV === "development",

  
  events: {
    async signIn(message) {
      console.log("User signed in:", message.user?.email);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
