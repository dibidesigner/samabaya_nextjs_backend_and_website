import { NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import getUserFromToken from "../../userdata";
import CustomerOrder from "../../Models/orderSchema";




export async function POST(request:Request){
    try {
        await verifyToken()
        await connectDB()

        const user = await getUserFromToken()

        if(!user){
            return NextResponse.json({
                success:true,
                message:"User not found"
            })
        }

        const orderid = await request.json()

        await CustomerOrder.findOneAndUpdate(
                { _id: orderid, userid: user?.id }, 
                { $set: { status: "cancelled" } }, 
                { new: true } 
                );


        return NextResponse.json({
            success:true,
            message:"Order Cancel"
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            error
        },{
            status:400
        })
    }
}