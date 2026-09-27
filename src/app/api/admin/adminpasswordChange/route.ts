import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "../../verifyToken"
import bcrypt from "bcryptjs"
import userModel from "../../Models/userSchema"


export async function POST(req:NextRequest){
    try {
        const userdetails = await verifyToken()
        const email = userdetails.email


        const body = await req.json()
        const {password,confirmpassword} = body

        if(!password || !confirmpassword){
               return NextResponse.json({
                  message:"Both Password not Matching"
               },{
                status:404
               })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const res = await userModel.findOneAndUpdate({email},{
          password:hashpassword
        })
        if(!res){
            return NextResponse.json({
                message:"Failed to Change Password"
            },
        {
            status:500
        })
        }
        return NextResponse.json(
            {
                message:"Succesfully Password Changed"
            },
            {
                status:200
            }
        )

    } catch (error) {
        return NextResponse.json(
            {
                message:"Some Technical Issues Occuring"
            },
            {
                status:500
            }
        )
    }
}