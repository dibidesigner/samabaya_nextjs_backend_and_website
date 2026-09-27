import userModel from "@/app/api/Models/userSchema";
import { sendEmail } from "@/app/api/functions/sendEmail";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const { email, fullname, mobileno, gender, pass, confirmpass } = body

        if (!email || !fullname || !mobileno || !pass || !confirmpass || !gender) {
            return NextResponse.json({
                success: false,
                error: "Input Missing..."
            })
        }

        if (pass !== confirmpass) {
            return NextResponse.json({
                success: false,
                error: "Password Not Matching...."
            })
        }

        const username = fullname.trim().toLowerCase().replace(/\s+/g, "");

        const hashpassword = await bcrypt.hash(pass, 10)

        const saveRecord = await userModel.create({
            username,
            fullname,
            mobile: mobileno,
            email,
            active: true,
            userRole: "customer",
            gender,
            customertype: false,
            membership: false,
            password: hashpassword,
            duty: []
        })

        if (!saveRecord) {
            return NextResponse.json({
                success: false,
                error: "failed to Register...."
            })
        }


        const htmlMessage = `
                    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <h2 style="color: #4CAF50;">Registration Successful!</h2>
                    <p>Hello ${fullname || "User"},</p>
                    <p>Welcome to <strong>Samabaya Smart Bazar Store</strong>! Your account has been successfully created.</p>

                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 0;"><strong>Mobile:</strong> ${mobileno}</p>
                        <p style="margin: 0;"><strong>Gender:</strong> ${gender}</p>
                    </div>

                    <p>You can now log in and start exploring exclusive offers and services.</p>

                    <a href="https://cooperativestore.com" 
                        style="display:inline-block; background:#4CAF50; color:white; text-decoration:none; 
                                padding:10px 20px; border-radius:5px; margin-top:10px;">
                        Login to Your Account
                    </a>

                    <br/><br/>
                    <p>If you didn’t create this account, please 
                        <a href="https://cooperativestore.com/contact" style="color:#4CAF50; text-decoration:none;">
                        contact Cooperative Store Support
                        </a>.
                    </p>

                    <br/>
                    <p>Best regards,</p>
                    <p><strong>Cooperative Store Team</strong></p>
                    </div>
                `




        const text = "Dont Share with anyone"
        const textmessage = "Your OTP for Email Verification"


        await sendEmail(email, textmessage, text, htmlMessage)



        return NextResponse.json({
            success: true,
            message: "Registered Successfully"
        })
    } catch (error) {
        return NextResponse.json({
            "success": false,
            "message": "Technical Issues are there"
        },
            {
                status: 500
            })
    }
}