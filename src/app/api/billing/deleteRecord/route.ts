import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import offLineOrderModel from "../../Models/offLineOrderSchema";





export async function POST(req:NextRequest){
    try {
        const {id} = await req.json()

        if(!id){
            return NextResponse.json({
                message:"Id Missing"
            },
        {
            status:401
        })
        }

        await connectDB()
        await verifyToken()

        const status = await offLineOrderModel.findByIdAndDelete(id)

        if(!status){
            return NextResponse.json({
                message:"Failed to Delete"
            },
        {
            status:400
        })
        }

        return NextResponse.json({
            message:"Successfully Deleted"
        },
    {
        status:200
    })

        

    } catch (error) {
        return NextResponse.json({
            message:"Something went wrong"
        },
        {
            status:500
        })
    }
}