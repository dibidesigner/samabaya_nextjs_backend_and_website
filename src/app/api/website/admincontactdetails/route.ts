import { connectDB } from "@/app/db/dbconnection";
import { NextResponse } from "next/server";
import detailsModel from "./contactDetails";
import { verifyToken } from "../../verifyToken";


export async function GET() {
  try {
    await connectDB();

    const contactdetails = await detailsModel.findOne();



    if (!contactdetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact Details not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        contactdetails,
      },
      {
        status: 200,
      }
    );
  } catch (_error: unknown) {
    const errorMessage = _error instanceof Error ? _error.message : "Contact Details not found";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      {
        status: 400,
      }
    );
  }
}




export async function POST(request: Request) {
  try {
    await verifyToken();
    await connectDB();

    const body = await request.json();
    const { id, ...storeFields } = body;

    let store;

    if (id) {
      store = await detailsModel.findByIdAndUpdate(
        id,
        { $set: storeFields },
        { new: true, runValidators: true }
      );

      if (!store) {
        return NextResponse.json(
          { success: false, message: "Store not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Store updated successfully", data: store },
        { status: 200 }
      );
    } else {
      // Create new store
      store = await detailsModel.create(storeFields);

      return NextResponse.json(
        { success: true, message: "Store created successfully", data: store },
        { status: 201 }
      );
    }
  } catch (_error: unknown) {
    return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
  }
}