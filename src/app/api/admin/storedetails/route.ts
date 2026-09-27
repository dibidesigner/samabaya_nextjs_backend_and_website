import { connectDB } from "@/app/db/dbconnection"
import { verifyToken } from "../../verifyToken"
import { NextResponse } from "next/server"
import storeDetailsModel from "./storeDetailsSchema"



export async function POST(request:Request){
    try {
        await verifyToken()
        await connectDB()

        const {storeName, mobileNo, emailId, storeAddress} =await request.json()

        if(!storeName || !mobileNo || !emailId || !storeAddress){
            return NextResponse.json({
                success:false,
                message:"Input not found"
            },{
                status:404
            })
        }

        const adding = await storeDetailsModel.create({
            storeName, mobileNo, emailId, storeAddress
        })


        if(!adding){
            return NextResponse.json({
                success:false,
                message:"Failed to add"
            },{
                status:204
            })
        }
        return NextResponse.json({
            success:true,
            message:"Successfully Added"
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:error
        },{
            status:400
        })
    }
}




export async function GET(){
    try {
        await verifyToken()
        await connectDB()

        const data = await storeDetailsModel.find()

        
        if(!data){
            return NextResponse.json({
                success:false,
                message:"No data in database"
            },{
                status:401
            })
        }

        return NextResponse.json({
            success:true,
            data,
            message:"Successfully Fetched Data"
        },
    {
        status:200
    })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:error
        })
    }
}