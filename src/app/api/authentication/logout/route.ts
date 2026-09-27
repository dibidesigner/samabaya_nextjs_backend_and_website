import { NextResponse } from "next/server";
import { connectDB } from "@/app/db/dbconnection";
import BlacklistToken from "@/app/api/authentication/logout/BlacklistToken";
import jwt, { JwtPayload as JWTType } from "jsonwebtoken"; // ✅ import JwtPayload
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "noaprojectbestepuraokomarmalangsenbescareerhuykoma";

export async function POST() {
  try {
    await connectDB();


    const cookieStore =await cookies();
    const token = cookieStore.get("authToken")?.value || null;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const decoded = jwt.verify(token, SECRET) as JWTType;

    if (!decoded.exp) {
      return NextResponse.json({ error: "Token has no expiry" }, { status: 400 });
    }

    await BlacklistToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.delete("authToken");

    return res;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Invalid token";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
