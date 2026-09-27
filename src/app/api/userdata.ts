import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import BlacklistToken from "./authentication/logout/BlacklistToken";


export interface DecodedUser extends JwtPayload {
  id: string;
  email: string;
}

const getUserFromToken = async (): Promise<DecodedUser | null> => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value || null;

  const JWT_SECRET =
    process.env.JWT_SECRET ||
    "noaprojectbestepuraokomarmalangsenbescareerhuykoma";

  if (!token) return null;

  const checkisexits = await BlacklistToken.find({token:token})
  if(checkisexits.length > 0){
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    if(!decoded){
      return null;
    }
    return decoded;
  } catch (err) {
   
    return null;
  }
};

export default getUserFromToken;
