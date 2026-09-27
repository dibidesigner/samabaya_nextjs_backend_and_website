import productModel from "@/app/api/Models/productShema"
import { verifyToken } from "@/app/api/verifyToken"
import { connectDB } from "@/app/db/dbconnection"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  
  try {


    await verifyToken()
    await connectDB()


    const { availability, productid } = await request.json()

 
    if (availability === undefined || !productid) {
      return NextResponse.json({
        success: false,
        message: "Please provide details"
      }, {
        status: 400
      })
    }

   
    const item = await productModel.findByIdAndUpdate(
      productid,
      { availability: availability },
      { new: true }
    )

    if (!item) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      }, {
        status: 404
      })
    }

   
    return NextResponse.json({
      success: true,
      message: "Product availability updated",
      updatedProduct: item
    }, {
      status: 201
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error"
    }, {
      status: 500
    })
  }
}
