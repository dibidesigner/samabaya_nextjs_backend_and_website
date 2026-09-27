import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/app/db/dbconnection";
import UserModel from "@/app/api/Models/userSchema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET as string;;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        // 1. Find or create user in DB
        let existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
            existingUser = await UserModel.create({
            fullname: user.name,
            email: user.email,
            profileImage: user.image,
            authProvider: account?.provider,
            username: null, // 👈 ensure username exists
            mobile: null,
            active: true,
          });
        }



        if (!existingUser.active) return false;

        // 2. Match normal login token payload
        const tokenPayload = {
          id: existingUser._id.toString(),
          username: existingUser.username,
          email: existingUser.email,
          mobile: existingUser.mobile,
          role: existingUser.userRole,
        };

        const appToken = jwt.sign(tokenPayload, SECRET, { expiresIn: "1h" });

        // 3. Save authToken cookie (same as normal login)
        const cookieStore =await cookies();
        cookieStore.set("authToken", appToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });



        return true;
      } catch (err) {;
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // async session({ session, token }) {
    //   if (token) {
    //     session.user.id = token.id;
    //   }
    //   return session;
    // },
    async redirect() {
    return "/pages/orders"; // always go here after login
  },
  },
});

export { handler as GET, handler as POST };
