import { NextResponse } from "next/server"
import { verifyToken } from "../../verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import addressModel from "../../Models/addressSchema"
import getUserFromToken from "../../userdata"

export async function POST(request:Request){
    try {
        await verifyToken()
        const {address, city,landmark,pincode  } =await request.json()

        if(!address || !city || !landmark || !pincode ){
             return NextResponse.json({
                success:false,
                message:"Address not found"
             })
        }

       
        await connectDB()

        const user = await getUserFromToken()


        const userAddress = await addressModel.create({
            user:user?.id,
            address: [
                {
                address,
                city,
                landmark,
                pincode,
                },
            ],
            });
        return NextResponse.json({
            success: true,
            message: "Address saved successfully",
            data: userAddress,
            });    


    } catch (error) {

        return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
        );
    }
}



export async function GET(){
    try {
        await verifyToken()
        await connectDB()

        const user = await getUserFromToken()

        const addr = await addressModel.find({user:user?.id}).sort({ _id: -1 }).limit(3);
  

        if(!addr){
            return NextResponse.json({
                success:false,
                message:"Address are not found"
            })
        }

        return NextResponse.json({
            success:true,
            addresses:addr
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            error
        })
    }
}


