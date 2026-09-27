import { verifyToken } from "@/app/api/verifyToken";
import productModel from "@/app/api/Models/productShema";
import { connectDB } from "@/app/db/dbconnection";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    const body = await req.json();

    let {
      page = 1,
      limit = 10,
      search = "",
      availability,
      lowStock,
      sortBy = "createdAt",   
      sortOrder = "desc",    
    } = body;


    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const skip = (page - 1) * limit;


    const match: any = {};

    if (search) {
      match.productName = { $regex: search.trim(), $options: "i" };
    }

    if (availability !== undefined) {
      match.availability = availability;
    }

    if (lowStock) {
      match.stock = { $lt: 10 };
    }

    // 📊 SORT
    const sort: any = {};

    if (sortBy === "price") sort.price = sortOrder === "asc" ? 1 : -1;
    else if (sortBy === "stock") sort.stock = sortOrder === "asc" ? 1 : -1;
    else if (sortBy === "name") sort.productName = sortOrder === "asc" ? 1 : -1;
    else sort.createdAt = sortOrder === "asc" ? 1 : -1;

    // always keep low stock priority
    sort.lowStock = -1;

    // 📦 TOTAL COUNT
    const total = await productModel.countDocuments(match);

    // 📦 DATA
    const products = await productModel.aggregate([
      { $match: match },

      {
        $addFields: {
          lowStock: { $lt: ["$stock", 10] },
        },
      },

      { $sort: sort },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          imageBase642: 0,
          imageBase643: 0,
          imageBase644: 0,
          imageBase645: 0,
        },
      },
    ]);

    return Response.json(
      {
        success: true,
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  
  try {
    await connectDB()
    const allData = await productModel.find().sort({ _id: -1 });

    return new Response(
      JSON.stringify({ products: allData }),
      {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Unauthorized or internal server error" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}