import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/api/verifyToken";
import getUserFromToken from "@/app/api/userdata";
import addToCartModel from "@/app/api/Models/addToCartSchema";
import { Types } from "mongoose";

export async function PUT(req: NextRequest) {
  try {
    await verifyToken();

    const body = await req.json();
    const { newquantity } = body;

    // Extract itemid from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const itemid = pathParts[pathParts.length - 1]; // last segment

    if (!Types.ObjectId.isValid(itemid)) {
      return NextResponse.json(
        { success: false, message: "Invalid item ID" },
        { status: 400 }
      );
    }

    const user = await getUserFromToken();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const updated = await addToCartModel.updateOne(
      { user: user.id, "products._id": itemid },
      { $set: { "products.$.quantity": newquantity } }
    );

    return NextResponse.json({
      success: true,
      message: `Item ${itemid} updated successfully`,
      updated,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: "Error updating item" },
      { status: 500 }
    );
  }
}
