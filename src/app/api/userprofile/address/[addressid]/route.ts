import addressModel from "@/app/api/Models/addressSchema"
import { verifyToken } from "@/app/api/verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import {NextResponse } from "next/server"

export async function DELETE(request: Request,
  { params }: { params: Promise<{ addressid: string }>}){
     try {
        await verifyToken()
        await connectDB()
 
        const { addressid } = await params;
        
        await addressModel.findOneAndDelete({_id:addressid})

        return NextResponse.json({
            success:true,
        },
        {
            status:200
        })
     } catch (error) {
         return NextResponse.json({
            success:false,
            error
        })
     }
}