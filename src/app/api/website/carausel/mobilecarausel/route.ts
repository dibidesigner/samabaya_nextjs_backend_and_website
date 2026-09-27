import mobilecarauselImageModel from "@/app/api/Models/mobileCarauselImage";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
  try {

    await verifyToken()
    await connectDB();

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({
        success: false,
        message: "Please send the image"
      }, { status: 400 });
    }

    await mobilecarauselImageModel.create({ mobilecarauselImage: image });

    return NextResponse.json({
      success: true,
      message: "Image saved successfully"
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}


export async function GET(){
    try {
      await connectDB()
       const imagedata =await mobilecarauselImageModel.find()


       if(!imagedata){
         return NextResponse.json({
          success:false,
          message:"Images not found"
         })
       }
       return NextResponse.json({
        success:true,
        data:imagedata
       })
    } catch (error) {
      return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
    }
}
