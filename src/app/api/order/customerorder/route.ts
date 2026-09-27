import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import CustomerOrder from "../../Models/orderSchema";
import getUserFromToken from "../../userdata";
import { connectDB } from "@/app/db/dbconnection";
import addressModel from "../../Models/addressSchema";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import validator from "validator";
import { generateOrderId } from "./orderHelper";

// -----------------------------
// Schemas & Types (Zod + TS)
// -----------------------------

// What getUserFromToken might return
interface TokenPayload {
  id: string;
  email?: string;
}

const tokenSchema = z.object({
  id: z
    .string()
    .refine((val: string) => Types.ObjectId.isValid(val), { message: "Invalid user ID" }),
});

type TokenType = z.infer<typeof tokenSchema>;


const productItemSchema = z.object({
  product: z.object({
    _id: z.string().refine((val: string) => Types.ObjectId.isValid(val), {
      message: "Invalid product ID",
    }),
  }),
  quantity: z.number().positive(),
  priceAtAddTime: z.number().positive(),
});

const orderSchema = z.object({
  totalPrice: z.number().positive(),
  fullname: z.string().min(2).max(100).trim(),
  mobileno: z
    .string()
    .refine((val: string) => validator.isMobilePhone(val, "any"), {
      message: "Invalid mobile number",
    }),
  address: z.string().min(5).trim(),
  city: z.string().min(2).trim(),
  landmark: z.string().min(2).trim(),
  pincode: z.string().refine((val: string) => validator.isPostalCode(val, "IN"), {
    message: "Invalid pincode",
  }),
  products: z.array(productItemSchema).nonempty(),
});

type ProductItemType = z.infer<typeof productItemSchema>;

// -----------------------------
// POST: Place Order
// -----------------------------
export async function POST(request: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    const body = await request.json();

    const parsed = orderSchema.safeParse(body);


    if (!parsed.success) {
      return NextResponse.json(
        { success: false },
        { status: 400 }
      );
    }

    const {
      totalPrice,
      fullname,
      mobileno,
      address,
      city,
      landmark,
      pincode,
      products,
    } = parsed.data;

    const tokenRaw = await getUserFromToken();
    const tokenParse = tokenSchema.safeParse(tokenRaw);

    if (!tokenParse.success) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const token = tokenParse.data as TokenType;


    // sanitize/normalize inputs
    const cleanFullname = validator.trim(fullname);
    const cleanMobileno = validator.trim(mobileno);
    const cleanAddress = validator.trim(address);
    const cleanCity = validator.trim(city);
    const cleanLandmark = validator.trim(landmark);
    const cleanPincode = validator.trim(pincode);

    // prepare products for DB
    const dbProducts = products.map((p: ProductItemType) => ({
      productId: new mongoose.Types.ObjectId(p.product._id),
      quantity: p.quantity,
      price: Number(p.priceAtAddTime * p.quantity),
    }));

    // create order
    await CustomerOrder.create({
      userid: new mongoose.Types.ObjectId(token.id),
      orderid: generateOrderId(),
      products: dbProducts,
      ordermode: "online",
      address: {
        address: cleanAddress,
        city: cleanCity,
        landmark: cleanLandmark,
        pincode: cleanPincode,
        fullname: cleanFullname,
        mobileno: cleanMobileno,
      },
      totalprice: totalPrice,
    });

    // Save address to addressModel if not existing
    const existingAddress = await addressModel.findOne({
      user: token.id,
      "address.fullname": cleanFullname,
      "address.mobileno": cleanMobileno,
      "address.address": cleanAddress,
      "address.city": cleanCity,
      "address.landmark": cleanLandmark,
      "address.pincode": cleanPincode,
    });

    if (!existingAddress) {
      await addressModel.create({
        user: token.id,
        address: [
          {
            fullname: cleanFullname,
            mobileno: cleanMobileno,
            address: cleanAddress,
            city: cleanCity,
            landmark: cleanLandmark,
            pincode: cleanPincode,
          },
        ],
      });
    }

    return NextResponse.json(
      { success: true, message: "Order placed successfully" },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: err },
      { status: 500 }
    );
  }
}

// -----------------------------
// GET: Get All Orders For User
// -----------------------------
export async function GET() {
  try {
    await verifyToken();
    await connectDB();

    const userRaw = await getUserFromToken();
    const parsed = tokenSchema.safeParse(userRaw);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = validator.trim(parsed.data.id);

    const orderlist = await CustomerOrder.find({ userid: userId })
      .populate({
        path: "products.productId",
        model: "productModel",
      })
      .sort({ createdAt: -1 });

    if (!orderlist || orderlist.length === 0) {
      return NextResponse.json({ success: true, orderlist: [] });
    }

    return NextResponse.json({ success: true, orderlist });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
