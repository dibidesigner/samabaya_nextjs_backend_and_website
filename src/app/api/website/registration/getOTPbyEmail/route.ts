import generateOTP from "@/app/api/authentication/otp"
import { sendEmail } from "@/app/api/functions/sendEmail"
import { connectDB } from "@/app/db/dbconnection"
import { NextRequest, NextResponse } from "next/server"
import otpModel from "./otpSchema"
import userModel from "@/app/api/Models/userSchema"



export async function POST(req:NextRequest){
    try {


        await connectDB()

        const email = await req.json()

        

        if(!email){
            return NextResponse.json({
                success:false,
                error:"Email id Missing"
            })
        }

        const otp = generateOTP()

        const emailisexist = await userModel.findOne({email:email})
        if(emailisexist){
            return NextResponse.json({
                success:false,
                error:"You are already registered with this email id"
            })
        }

        const savedata = await otpModel.findOneAndUpdate(
            { email: email },
            { otp, updatedAt: new Date() }, 
            { upsert: true, new: true, setDefaultsOnInsert: true } 
            );

        if(!savedata){
            return NextResponse.json({
                success:false,
                error:"Failed to save otp.."
            })
        }

        const htmlMessage = `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <h2 style="color: #4CAF50;">🔒 Email Verification Request</h2>
                            <p>Hello ${email || "User"},</p>
                            <p>We received a request to verify email. Please use the following OTP to continue:</p>
                            
                            <div style="background: #f4f4f4; padding: 10px; border-radius: 8px; margin: 20px 0; text-align: center;">
                            <h1 style="color: #333; letter-spacing: 3px;">${otp}</h1>
                            </div>
        
                            <p>This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                            <p>If you didn’t request this, you can safely ignore this email.</p>
                            <p>If you have not requested this action, please <a href="https://cooperativestore.com" style="color:#4CAF50; text-decoration:none;">contact cooperativestore.com</a>.</p>
                            <br/>
                            <p>Best regards,</p>
                            <p><strong>Cooperative Store Security Team</strong></p>
                        </div>
                        `;
        

        const text = "Dont Share with anyone"  
        const textmessage = "Your OTP for Email Verification"  
        await sendEmail(email,textmessage,text,htmlMessage)   
        

        return NextResponse.json({
            success:true,
            message:`OTP Sent to ${email}`
        })
        
    } catch (error) {
        
    }
}