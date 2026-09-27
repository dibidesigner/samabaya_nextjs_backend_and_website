import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import offLineOrderModel from "../../Models/offLineOrderSchema";
import productModel from "../../Models/productShema";
import { generateOrderNumber } from "../../extrafunction/generateOrderNumber";


export async function POST(req: NextRequest) {
  try {

    await verifyToken();
    await connectDB();

    const body = await req.json();

    const {
      buyerName = "Non Provided",
      buyerMo,
      billby,
      billingdata,
      totalMoney
    } = body;

    if (!billingdata || billingdata.length === 0) {
      return NextResponse.json(
        { message: "No products added to billing" },
        { status: 400 }
      );
    }


  const productList = billingdata.map((item: any) => {

      const isWeight = item.productType === "open"; 



      const discountAmount = Number(item.discountAmount) || 0;
     
        const itemTotal = isWeight
          ? (item.price / 1000) * (item.weightQty || 0)
          : item.price * (item.cartQuantity || 0);

        return {
          product: item._id,
          productPrice: item.price,

          
          quantity: isWeight ? undefined : item.cartQuantity,
          weight: isWeight ? item.weightQty : undefined,

          totalPrice : itemTotal - discountAmount,
          discountPercent : item.discount
        };
  });


  //Total Bill Calculation
  const totalAmount = billingdata.reduce((acc: number, item: any) => {

        const isWeight = item.productType === "open";

        const itemTotal = isWeight
          ? (item.price / 1000) * (item.weightQty || 0)
          : item.price * (item.cartQuantity || 0);

        return acc + itemTotal;

    }, 0);

  const offlineorderstatus = await offLineOrderModel.create({
        orderid: generateOrderNumber(),
        customername: buyerName,
        cutomermobileno: buyerMo,
        customermembership: false,
        billingProcessby: billby,
        totalPrice: totalMoney,
        product: productList,
        billingDone: true
      });


  for (const item of billingdata) {

        const isWeight = item.productType === "open";

        const decreaseStock = isWeight
          ? (item.weightQty || 0) 
          : item.cartQuantity || 0;

        await productModel.findByIdAndUpdate(item._id, {
          $inc: {
            stock: -decreaseStock
          }
        });
      }

    return NextResponse.json(
      {
        message: "Order Placed Successfully",
        offlineorderstatus
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );

  }
}



export async function GET(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const timefilter = searchParams.get("timefilter"); 
    const search = searchParams.get("searchId");   
    

    const skip = (page - 1) * limit;

    let query: any = {};

  
    if (timefilter) {
      const date = new Date(timefilter);

      const month = date.getMonth();
      const year = date.getFullYear();

      const start = new Date(year, month, 1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(year, month + 1, 0);
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }


    if (search) {
      query.$or = [
        { orderid: { $regex: search, $options: "i" } },
        { customername: { $regex: search, $options: "i" } },
      ];
    }

    const offlineorderlist = await offLineOrderModel
      .find(query)
      .populate({
        path: "product.product",
        select: "productName price discountPercent",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);


    const total = await offLineOrderModel.countDocuments(query);

    return NextResponse.json(
      {
        offlineorderlist,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}