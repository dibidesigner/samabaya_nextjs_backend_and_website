import { NextResponse } from "next/server";
import { connectDB } from "@/app/db/dbconnection";
import { verifyToken } from "../../verifyToken";
import addToCartModel from "../../Models/addToCartSchema";
import productModel from "../../Models/productShema";
import getUserFromToken from "../../userdata";
import { Document } from "mongoose";

// ==========================
// Types
// ==========================

// Cart Product type
interface CartProduct {
  product: string | { _id: string };
  quantity: number;
  priceAtAddTime: number;
}

// Extend Mongoose Document for Cart
interface CartDoc extends Document {
  user: string;
  products: CartProduct[];
  totalItems: number;
}

// ==========================
// POST: Add to Cart
// ==========================
export async function POST(request: Request) {
  try {
    await verifyToken();
    await connectDB();

    const body = await request.json();
    const { itemid, quantity, itemPrice } = body;

    const user = await getUserFromToken();

    // Check product exists
    const product = await productModel.findById(itemid);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    let cart = (await addToCartModel.findOne({ user: user?.id })) as CartDoc | null;

    if (!cart) {
      cart = new addToCartModel({
        user: user?.id,
        products: [
          {
            product: itemid,
            quantity,
            priceAtAddTime: itemPrice,
          },
        ],
        totalItems: quantity,
      }) as CartDoc;
    } else {

      const existingProductIndex = cart.products.findIndex((p: CartProduct) => {
        const prodId = typeof p.product === "string" ? p.product : p.product._id;
        return prodId.toString() === itemid;
      });

      if (existingProductIndex > -1) {

        cart.products[existingProductIndex].quantity += quantity;
      } else {

        cart.products.push({
          product: itemid,
          quantity,
          priceAtAddTime: itemPrice,
        });
      }


      cart.totalItems = cart.products.reduce(
        (acc: number, p: CartProduct) => acc + p.quantity,
        0
      );
    }

    await cart.save(); 

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Unknown error" },
      { status: 500 }
    );
  }
}

// ==========================
// GET: Get Cart
// ==========================
export async function GET() {
  try {
    await verifyToken();
    const user = await getUserFromToken();
    await connectDB();

    const checkoutlist = await addToCartModel
      .findOne({ user: user?.id })
      .populate("products.product");

    if (!checkoutlist || checkoutlist.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No products found in cart",
      },
    {
      status:404
    });
    }

    return NextResponse.json({
      success: true,
      cartlist: checkoutlist,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: "Unknown error" },
      { status: 500 }
    );
  }
}
