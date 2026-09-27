import { NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import productModel from "../../Models/productShema";



export async function GET() {
    try {
       await connectDB()

       const productList = await productModel.find({ stock: { $gt: 0 } }).select("productName quantity price productUnit stock imageBase641").limit(10)

       if(!productList){
            return NextResponse.json({
                message:"Product Not Found"
            },
            {
                status:401
            })
            }
        return NextResponse.json({
            productList
        },
    {
        status:200
    })    

        
    } catch (error) {
        return NextResponse.json({
            message:error
        },{
            status:500
        })
    }
    
}