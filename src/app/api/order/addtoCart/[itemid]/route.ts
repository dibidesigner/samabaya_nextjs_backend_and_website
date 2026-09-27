import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import addToCartModel from "@/app/api/Models/addToCartSchema";
import getUserFromToken from "@/app/api/userdata";

// DELETE /api/order/addtoCart/[itemid]
export async function DELETE(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    // Get itemid from URL
    const { pathname } = new URL(req.url);
    const parts = pathname.split("/");
    const itemid = parts[parts.length - 1]; // last segment = [itemid]

    if (!itemid) {
      return NextResponse.json(
        { success: false, message: "Item id not found" },
        { status: 400 }
      );
    }

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const updatedCart = await addToCartModel.findOneAndUpdate(
      { user: user.id },
      { $pull: { products: { _id: itemid } } },
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
      cart: updatedCart,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
