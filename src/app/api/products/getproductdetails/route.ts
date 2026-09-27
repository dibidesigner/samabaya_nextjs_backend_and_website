import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import productModel from "../../Models/productShema";




export async function POST( request: NextRequest){
    try {
        await verifyToken()
        await connectDB()

        const id = await request.json()

        let product;
        
        product = await productModel.findById(id)

       


        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
            }

        return NextResponse.json(
            { responsedata: product },
            { status: 200 }
            );

    } catch (error) {
        return NextResponse.json({
            message:"Something went wrong"
        },
    {
        status:500
    })
    }
}

