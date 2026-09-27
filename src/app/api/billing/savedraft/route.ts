import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import offLineOrderModel from "../../Models/offLineOrderSchema";


export async function POST(req:NextRequest){
    try {
        await verifyToken()

        await connectDB()
  
        const body = await req.json()

        
        const {buyerName="Non Provided",buyerMo,billby,totalMoney,billingdata} = body

        const offlineorderstatus = await offLineOrderModel.create({
            customername:buyerName,
            cutomermobileno:buyerMo,
            customermembership:false,
            billingProcessby:billby,
            totalPrice:Number(totalMoney),
            product:billingdata,
            billingDone:false
        })


        if (!offlineorderstatus){
            return NextResponse.json({
                message:"Failed to place order"
            },
        {
            status:400
        })
        }


        return NextResponse.json({
            message:"Order Placed"
            },
            {
                status:200
            })
    } catch (error) {
       
        return NextResponse.json({
            message:"Something went Wrong"
        },
    {
        status:500
    })
    }
}



export async function GET(){
    try {
        await verifyToken()
        await connectDB()

        const offlineorderlist = await offLineOrderModel.find().select("_id").limit(3).sort("-createdAt")

        if(!offlineorderlist){
            return NextResponse.json({
                message:"Order History Not Found"
            },
            {
                status:404
            })
        }

        return NextResponse.json({
            offlineorderlist
        },
        {
            status:200
        }
    )
    } catch (error) {
    
        return NextResponse.json({
            message:"Something went wrong"
        },
    {
        status:500
    })
    }
}


  
