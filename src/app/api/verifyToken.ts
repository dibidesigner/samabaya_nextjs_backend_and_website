import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import BlacklistToken from "@/app/api/authentication/logout/BlacklistToken";
import { connectDB } from "../db/dbconnection";

export interface DecodedToken extends JwtPayload {
  id: string;
  email?: string;
}

export const verifyToken = async (): Promise<DecodedToken> => {

  
  await connectDB();

  const cookieStore = await cookies();

  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Invalid login");
  }

  const blacklisted = await BlacklistToken.findOne({ token });
  if (blacklisted) {
    throw new Error("Token is blacklisted");
  }

  const secret = process.env.JWT_SECRET || "noaprojectbestepuraokomarmalangsenbescareerhuykoma";
  if (!secret) {
    throw new Error("JWT secret not configured");
  }

  const decoded = jwt.verify(token, secret) as DecodedToken;

  if (!decoded?.id) {
    throw new Error("Invalid token");
  }

  return decoded;
};
