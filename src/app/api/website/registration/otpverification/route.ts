import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import otpModel from "../getOTPbyEmail/otpSchema";




export async function POST(req:NextRequest){
    try {
        await connectDB()

        const body = await req.json()

        const {email,newotp} = body

        const otpNumber = Number(newotp)

        const record = await otpModel.findOne({ email: email});
        const dbotp = Number(record.otp)

        if (dbotp !== otpNumber ) {
          return NextResponse.json({
            success:false,
            message:"Invalid OTP"
          })
        } 

        await otpModel.findOneAndUpdate(
            {email},
            {emailVerified:true},
            { new: true }
        )

        return NextResponse.json({
            success:true,
            message:"Successfully Verified"
        })
    } catch (error) {
       return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
    }
}