import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import { NextResponse } from "next/server";
import productModel from "../../../Models/productShema";


export async function PUT(req: Request, { params }: any) {
  try {
    await verifyToken()
    await connectDB();

    const { id } = await params;


    const body = await req.json();


    if (!body) {
      return NextResponse.json({
        message: "No Changes Data"
      },
        {
          status: 404
        })
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        productName: body.productName,
        productCode: body.productCode,
        productType: body.productType,
        barcode: body.barcode,
        productCategory: body.productCategory,
        price: body.price,
        purchasePrice: body.purchasePrice,
        quantity: body.quantity,
        initialStock: body.stock,
        stock: body.stock,
        weightUnit: body.weightUnit,
        availability: body.availability,
        benifit: body.benifit,
        description: body.description,
        imageBase641: body.imageBase641,
        imageBase642: body.imageBase642,
        imageBase643: body.imageBase643,
        imageBase644: body.imageBase644,
        imageBase645: body.imageBase645,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        responsedata: updatedProduct,
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