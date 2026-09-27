import { NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import getUserFromToken from "../../userdata";
import userModel from "../../Models/userSchema";
import { connectDB } from "@/app/db/dbconnection";
import CustomerOrder from "../../Models/orderSchema";



export async function GET() {
    try {
        await verifyToken()
        await connectDB()

        const user = await getUserFromToken()
        const userdata = await userModel.findById(user?.id)

        const allData = await CustomerOrder.find({ deliveryby: userdata?.fullname }).populate("userid").populate("products.productId") || [];

        const totalorder = allData?.length

        const totalDelivered = allData.filter((item) => item.status == 'delivered')

        const totalPending = allData.filter((item) => item.status == "pending")
        const totalCanceled = allData.filter(
            (item) => item.status?.toLowerCase() === "cancelled"
        ).length;

        const responsedata = {
            allData,
            totalorder,
            pending: totalPending.length || 0,
            delivered: totalDelivered.length || 0,
            canceled: totalCanceled || 0
        };



        return NextResponse.json({
            responsedata
        }, {
            status: 200
        })


    } catch (error) {
        return NextResponse.json({
            "message": "Something went wrong"
        }, {
            status: 500
        })
    }
}