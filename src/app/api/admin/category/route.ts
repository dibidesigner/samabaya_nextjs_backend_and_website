import { connectDB } from "@/app/db/dbconnection";
import { verifyToken } from "../../verifyToken";
import { NextResponse } from "next/server";
import productCategoryModel from "../../Models/productCategorySchema";

export async function POST(request: Request) {
  try {
   
    await verifyToken();

    
    await connectDB();

    const { categoryname } = await request.json();

    if (!categoryname) {
      return NextResponse.json(
        { success: false, message: "Input not found" },
        { status: 400 }
      );
    }

    const addingCategory = await productCategoryModel.create({
      prouctCategory: categoryname 
    });

    if (!addingCategory) {
      return NextResponse.json(
        { success: false, message: "Failed to add category" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully added new category" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "failed to add catrgory" },
      { status: 500 }
    );
  }
}


export async function GET(){
    try {
      await connectDB()

      const data = await productCategoryModel.find()
      
      if (!data){
        return NextResponse.json({
          success:false,
          message:"Category Not found"
        })
      }

      return NextResponse.json({
        success:true,
        data:data
      })
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "failed find category catrgory" },
        { status: 500 }
    );
    }
}



