import { connectDB } from "@/app/db/dbconnection";
import { verifyToken } from "../../verifyToken";
import { NextResponse } from "next/server";
import weightunitModel from "../../Models/unitSchema";


export async function POST(request: Request) {
  try {
    // 2. Verify Token
    await verifyToken();

    // 3. Connect to DB
    await connectDB();

    // 4. Parse Request Body
    const { weightunitname } = await request.json();



    if (!weightunitname) {
      return NextResponse.json(
        { success: false, message: "Input not found" },
        { status: 400 }
      );
    }

    // 5. Save Category
    const addingCategory = await weightunitModel.create({
      weightunit: weightunitname // spelling matches schema
    });

    if (!addingCategory) {
      return NextResponse.json(
        { success: false, message: "Failed to add category" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully added new weight unit" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "failed to add weightunit" },
      { status: 500 }
    );
  }
}


export async function GET(){
    try {
      const data = await weightunitModel.find()
      if (!data){
        return NextResponse.json({
          success:false,
          message:"Weight Unit Not found"
        })
      }

      return NextResponse.json({
        success:true,
        data:data
      })
    } catch (error) {
      return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
    }
}



