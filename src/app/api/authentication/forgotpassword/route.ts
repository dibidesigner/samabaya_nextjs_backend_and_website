import { NextResponse } from "next/server"
import { connectDB } from "@/app/db/dbconnection"
import userModel from "../../Models/userSchema"
import generateOTP from "../otp"
import otpModel from "../../website/registration/getOTPbyEmail/otpSchema"
import { sendEmail } from "../../functions/sendEmail"



export async function POST(request:Request){
    try {
        await connectDB()

        const emailid = await request.json()

        if(!emailid){
                    return NextResponse.json({
                        success:false,
                        error:"Email id Missing"
                    })
                }

            

        if(!emailid){
            return NextResponse.json({
                success:false,
                message:"Input not found"
            })
        }

        const isexist = await userModel.findOne({email:emailid})

        if(!isexist){
            return NextResponse.json({
                success:false,
                message:"You are not registered"
            })
        }

        const otp = generateOTP()   

        const savedata = await otpModel.findOneAndUpdate(
            { email: emailid },
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
                            <h2 style="color: #4CAF50;">🔒 Forgot Password Request</h2>
                            <p>Hello ${emailid || "User"},</p>
                            <p>We received a request to verify email. Please use the following OTP to continue:</p>
                            
                            <div style="background: #f4f4f4; padding: 10px; border-radius: 8px; margin: 20px 0; text-align: center;">
                            <h1 style="color: #333; letter-spacing: 3px;">${otp}</h1>
                            </div>
        
                            <p>This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                            <p>If you didn’t request this, you can safely ignore this email.</p>
                            <p>If you have not requested this action, please <a href="https://samabayasmartbazar.com" style="color:#4CAF50; text-decoration:none;">contact samabayasmartbazar.com</a>.</p>
                            <br/>
                            <p>Best regards,</p>
                            <p><strong>Samabaya Smart Bazar Security Team</strong></p>
                        </div>
                        `;

        const text = "Dont Share with anyone"  
        const textmessage = "Your OTP for Email Verification"  
        await sendEmail(emailid,textmessage,text,htmlMessage)                
        

        return NextResponse.json({
            success:true,
            message:`6 Digit OTP Sent to ${emailid}`
        })

    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"Internal error"
        })
    }
}