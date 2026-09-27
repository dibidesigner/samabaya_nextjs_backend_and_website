
import { NextResponse } from "next/server"
import getUserFromToken from "../../userdata"
import { verifyToken } from "../../verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import userModel from "../../Models/userSchema"
import bcrypt from 'bcryptjs';
import generateOTP from "../otp"
import { sendEmail } from "../../functions/sendEmail"





export async function PUT(request:Request){
    try {
        await verifyToken()
        await connectDB()

        const {password,confirmpassword} =await request.json() 
        if(!password || !confirmpassword){
            return NextResponse.json({
                success:false,
                message:"Input Missing"
            })
        }


        if(password !== confirmpassword){
            return NextResponse.json({
                success:false,
                message:"Password not matching"
            })
        }

        const user = await getUserFromToken()

        const userdatafromdb = await userModel.findOne({ _id: user?.id });


        const otp = generateOTP()


        const htmlMessage = `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <h2 style="color: #4CAF50;">🔒 Password Change Request</h2>
                    <p>Hello ${userdatafromdb?.email || "User"},</p>
                    <p>We received a request to change your password. Please use the following OTP to continue:</p>
                    
                    <div style="background: #f4f4f4; padding: 10px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h1 style="color: #333; letter-spacing: 3px;">${otp}</h1>
                    </div>

                    <p>This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    <p>If you didn’t request a password change, you can safely ignore this email.</p>
                    <p>If you have not requested this action, please <a href="https://cooperativestore.com" style="color:#4CAF50; text-decoration:none;">contact cooperativestore.com</a>.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>Cooperative Store Security Team</strong></p>
                </div>
                `;

        

        await userModel.findOneAndUpdate({email:user?.email},
            {
              otp
            }
          )
        const text = "Dont Share with anyone"  
        const textmessage = "Your OTP for changing password"  
        await sendEmail(userdatafromdb?.email,textmessage,text,htmlMessage)  

        return NextResponse.json({
            success:true,
            message:`OTP Sent to ${userdatafromdb?.email}`
        })
    } catch (error) {

        return NextResponse.json({
            success:false,
            error
        })
    }
}


export async function POST(request:Request){
    try {
        await verifyToken()
        await connectDB()

        const {otp,password,confirmpassword} = await request.json()

        if(!password || !confirmpassword || !otp){
            return NextResponse.json({
                success:false,
                message:"Input Missing"
            })
        }

        


        if(password !== confirmpassword){
            return NextResponse.json({
                success:false,
                message:"Password not matching"
            })
        }
        const user = await getUserFromToken()

        const userdata = await userModel.findOne({email:user?.email})

        const otpCode = Number(Array.isArray(otp) ? otp.join("") : otp)

        if(otpCode !== userdata.otp){
            return NextResponse.json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        await userModel.findOneAndUpdate({email:user?.email},
            {
              password:hashpassword
            }
          )

        return NextResponse.json({
            success:true,
            message:"Successfully Changed Password"
        })   




        
    } catch (error) {
        return NextResponse.json({
            success:false,
            error
        })
    }
}