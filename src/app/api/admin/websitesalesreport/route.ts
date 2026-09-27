import { NextResponse } from "next/server"
import { verifyToken } from "../../verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import CustomerOrder from "../../Models/orderSchema"
import offLineOrderModel from "../../Models/offLineOrderSchema"


export async function GET(){
  try {
    await verifyToken()
    await connectDB()

    const orders = await CustomerOrder.find().sort({ createdAt: 1 });

    const storereport = await offLineOrderModel.find().sort({ createdAt: 1 });


    if(!orders){
        return NextResponse.json({
            success:false,
            message:"Order List Not found"
        },
    {
        status:404
    })
    }

    
    const reports = orders.map((data) => ({
        date: data.createdAt.toISOString().split("T")[0],
        totalprice: data.totalprice
        }));

    const salereports = storereport.map((data) => ({
        date: data.createdAt.toISOString().split("T")[0],
        totalprice: data.totalPrice
        }));    



   if(!reports){
    return NextResponse.json({
        success:false,
        message:"Repotrs Not Found"
    })
   }

   const allreport = {
        reports,salereports
   }

   return NextResponse.json({
    success:true,
    allreport
   })
  } catch (error) {
    return NextResponse.json({
        success:false,
        message:"Internal Error"
    })
  }
}