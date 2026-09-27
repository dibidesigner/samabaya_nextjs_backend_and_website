import CustomerOrder from "@/app/api/Models/orderSchema"
import productModel from "@/app/api/Models/productShema"
import { verifyToken } from "@/app/api/verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import { NextResponse } from "next/server"


export async function POST(request:Request){
    try {
        await verifyToken()
        await connectDB()


        const {productId} = await request.json()
        

        if (!productId){
            return NextResponse.json({
                "response":"Please provide product id"
            },
        {
            status:400
        })
        }



        const checkorder = await productModel.findOne({"products.productId":productId})
       

        if(checkorder){
            return NextResponse.json({
                "success":false,
                "message":"Product Already Ordered"
            },
        {
            status:409
        })
        }


      
        await productModel.findByIdAndDelete({_id:productId})

        return NextResponse.json(
                {
                    success: true,
                    message: "Product deleted successfully",
                },
                { status: 200 }
                );

        
        



    } catch (error) {
       return NextResponse.json(
        {
            "success":false,
            "message":"Technical Issue"
        },
        {
            status:500
        }
       )
    }
}