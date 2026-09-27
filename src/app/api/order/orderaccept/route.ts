import { connectDB } from "@/app/db/dbconnection"
import { verifyToken } from "../../verifyToken"
import { NextResponse } from "next/server"






export async function POST(request:Request){
    try {
        
        await verifyToken()
        await connectDB()


        const {itemid}=await request.json()

       


        return NextResponse.json(
            {
                success:true,
                message:`Order accepted of ${itemid}`
            },{
                status:200
            }
        )
    } catch (error) {
        
    }
}