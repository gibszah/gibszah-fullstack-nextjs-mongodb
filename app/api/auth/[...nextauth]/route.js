// import startDb from "@/lib/db";
// import UserModel from "@/models/userModel";
// import { NextAuthOptions } from "next-auth";
// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     CredentialsProvider({
//       type: "credentials",
//       credentials: {},
//       async authorize(credentials, req) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };

//         await startDb();

//         const user = await UserModel.findOne({ email });
//         if (!user) throw Error("email/password doesn't match!");

//         const passwordMatch = await user.comparePassword(password);
//         if (!passwordMatch) throw Error("email/password does not match!");

//         return {
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           id: user._id,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     jwt(params: any) {
//       if (params.user?.role) {
//         params.token.role = params.user.role;
//         params.token.id = params.user.id;
//       }
//       //return final token
//       return params.token;
//     },
//     session({ session, token }) {
//       if (session.user) {
//         (session.user as { id: string }).id = token.id as string;
//         (session.user as { role: string }).role = token.role as string;
//       }
//       return session;
//     },
//   },
// };

// const authHandler = NextAuth(authOptions);

// // export const GET = authHandler;
// // export const POST = authHandler;

// export { authHandler as GET, authHandler as POST };

import startDb from "@/lib/db";
import UserModel from "@/models/userModel";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        await startDb();

        const user = await UserModel.findOne({ email });
        if (!user) throw Error("email/password doesn't match!");

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw Error("email/password does not match!");

        return {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user._id,
        };
      },
    }),
  ],
  callbacks: {
    jwt(params) {
      if (params.user?.role) {
        params.token.role = params.user.role;
        params.token.id = params.user.id;
      }
      //return final token
      return params.token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
