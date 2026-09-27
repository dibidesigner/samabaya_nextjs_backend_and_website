import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import userModel from "../../Models/userSchema";
import getUserFromToken from "../../userdata";
import CustomerOrder from "../../Models/orderSchema";



export async function POST(req:NextRequest){
    try {
        await verifyToken()

        await connectDB()

        const { deliveryid } = await req.json();

      
        const status = await CustomerOrder.findByIdAndUpdate(deliveryid,
            {
                status:"delivered"
            },
            {
                new:true
            }
        )

        if(!status){
            return NextResponse.json({
                message: "Failed to Delivery",
                },{
                    status:201
                });    

        }
        

        return NextResponse.json({
            message: "User status updated successfully",
            },{
                status:200
            });    

    } catch (error) {
       return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
    }
}