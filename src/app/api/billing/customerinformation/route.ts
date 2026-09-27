import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import billingTempModel from "../../Models/billingRecordTempSchema";



export async function POST(req:NextRequest){
    try {
        await verifyToken()
        await connectDB()

        const mobileno = await req.json()
        if(!mobileno){
            return NextResponse.json({
                success:false,
                error:"Mobile No Missing"
            },{
                status:404
            })
        }

        const customerinformation = await billingTempModel.findOne({cutomermobileno:mobileno})
        if(!customerinformation){
            return NextResponse.json({
                success:false,
                error:"Customer Information not found"
            },{
                status:404
            })
        }

        return NextResponse.json({
            success:true,
            customerinformation
        },{
            status:200
        })
    } catch (error) {
         return NextResponse.json({
            "Message" : "Something went wrong"
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


        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); 

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todayRecords = await billingTempModel.find({
            createdAt: {
                $gte: startOfToday, 
                $lte: endOfToday
            }
        });

        if(!todayRecords){
            return NextResponse.json({
                success:false,
                error:"Record not found"
            },{
                status:404
            })
        }

        return NextResponse.json({
            success:true,
            todayRecords
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json({
            "Message" : "Something went wrong"
        },
    {
        status:500
    })
    }
}