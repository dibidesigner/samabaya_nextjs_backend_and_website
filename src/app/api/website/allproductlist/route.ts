import { connectDB } from "@/app/db/dbconnection";
import productModel from "../../Models/productShema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    /* ---------------- Query Params ---------------- */

    let categories = searchParams.getAll("categories");
    if (categories.length === 0) {
      categories = searchParams.getAll("categories[]");
    }

    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : null;

    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : null;

    const rating = searchParams.get("rating")
      ? Number(searchParams.get("rating"))
      : null;

    const sort = searchParams.get("sort");

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    /* ---------------- Filters ---------------- */

    const query: any = {
      availability: true,
    };

    if (categories.length > 0) {
      query.productCategory = { $in: categories };
    }

    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) query.price.$gte = minPrice;
      if (maxPrice !== null) query.price.$lte = maxPrice;
    }

    /* ---------------- Sorting ---------------- */

    let sortQuery: any = {};
    if (sort === "price-low" || sort === "price_asc") sortQuery.price = 1;
    if (sort === "price-high" || sort === "price_desc") sortQuery.price = -1;
    if (sort === "name-asc") sortQuery.productName = 1;
    if (sort === "name-desc") sortQuery.productName = -1;

   

    const [allproduct, totalCount] = await Promise.all([
      productModel.find(query).sort(sortQuery).skip(skip).limit(limit),
      productModel.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        allproduct,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
