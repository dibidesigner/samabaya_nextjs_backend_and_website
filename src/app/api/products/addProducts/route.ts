import productModel from "@/app/api/Models/productShema";
import { connectDB } from "@/app/db/dbconnection";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/api/verifyToken";
import getUserFromToken from "@/app/api/userdata";


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb', 
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    await verifyToken(); 
    await connectDB();

    const userdetails = await getUserFromToken();


    if (!userdetails){
      return NextResponse.json(
        {
          "message":"Unauthorize Access"
        },{
          status:400
        }
      )
    }
    
   
    const user = userdetails?.id;


    const {
            productname,
            productType,
            productCode,
            barcode,
            benefit,
            price,
            purchasePrice,
            quantity,
            category,
            stock,
            weightunit,
            availability,
            imageBase641,
            imageBase642,
            imageBase643,
            imageBase644,
            imageBase645,
            description,
            
          } = await req.json();
    

    if (
      !user ||
      !productname ||
      !productType || !productCode ||
      !barcode ||
      !benefit ||
      !price || !purchasePrice ||
      !stock ||
      !category 
    ) {
      return NextResponse.json(
        { message: "Please fill all the details", success: false },
        { status: 404 }
      );
    }



    if (
      !imageBase641 ||
      !imageBase642 ||
      !imageBase643 ||
      !imageBase644 ||
      !imageBase645
    ) {
      return NextResponse.json(
        { message: "Please provide images", success: false },
        { status: 404 }
      );
    }

    const saving = await productModel.create({
              user,
              productName: productname,
              productCode,
              productType,
              purchasePrice,
              barcode,
              price,
              quantity,
              benifit: benefit,
              initialStock:stock,
              stock,
              productCategory: category,
              availability,
              productUnit: weightunit,
              description,
              imageBase641,
              imageBase642,
              imageBase643,
              imageBase644,
              imageBase645,
      });


    if (!saving) {
      return NextResponse.json(
        { message: "Failed to add Product", success: false },
        { status: 204 }
      );
    }

    return NextResponse.json(
      { message: "Product Added successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message:  "Server error" }, { status: 500 });
  }
}
