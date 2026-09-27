import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import userModel from "../../Models/userSchema";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../functions/sendEmail";



export async function POST(req:NextRequest){
    try {
        const body = await req.json()
        if(!body){
            return NextResponse.json({
                success:false,
                error:"Input Data not found"
            })
        }

        const {emailid,password, cpassword} = body

        if(!emailid || !password || !cpassword){
            return NextResponse.json({
                success:false,
                error:"Password not found"
            })
        }

        if(password !== cpassword){
            return NextResponse.json({
                success:false,
                error:"Password not Matching"
            })
        }

        await connectDB()

        const user =await userModel.findOne({email:emailid})

        if(!user){
            return NextResponse.json({
                success:false,
                error:"User not exist"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const saving = await userModel.findOneAndUpdate(
            {email:emailid},
            {
                password:hashpassword
            }
        )

        if(!saving){
            return NextResponse.json({
                success:false,
                error:"Failed to Change Password"
            })
        }

        const htmlMessage = `
                                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                                    <h2 style="color: #4CAF50;">✅ Password Changed Successfully</h2>
                                    <p>Hello ${emailid || "User"},</p>
                                    <p>This is a confirmation that your password has been changed successfully for your 
                                    <strong>Samabaya Smart Bazar</strong> account.</p>

                                    <p>If you made this change, you can safely ignore this message.</p>
                                    <p>If you did <strong>not</strong> change your password, please 
                                    <a href="https://samabayasmartbazar.com/reset-password" 
                                        style="color:#4CAF50; text-decoration:none;">
                                        reset your password immediately
                                    </a> 
                                    or contact our support team.
                                    </p>

                                    <div style="margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px;">
                                    <p style="font-size: 14px; color: #555;">
                                        For any help, visit 
                                        <a href="https://samabayasmartbazar.com/contact" 
                                        style="color:#4CAF50; text-decoration:none;">
                                        samabayasmartbazar.com/contact
                                        </a>.
                                    </p>
                                    </div>

                                    <br/>
                                    <p>Best regards,</p>
                                    <p><strong>Samabaya Smart Bazar Security Team</strong></p>
                                </div>
                                `;
        
        const text = "Dont Share with anyone"  
        const textmessage = "Successfully Changed your password"  
        await sendEmail(emailid,textmessage,text,htmlMessage) 

        return NextResponse.json({
            success:true,
            message:"Successfully Password changed"
        })

        
    } catch (error) {
        return NextResponse.json({
            message:"Internal Issue"
        },{
            status:500
        })
    }
}