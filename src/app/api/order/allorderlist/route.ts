import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import CustomerOrder from "../../Models/orderSchema";
import { connectDB } from "@/app/db/dbconnection";

export async function POST(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    const  {filterstatus,searchId,timefilter,limit=10,page=1}= await req.json();
    const skip = (page - 1) * limit;
  


    let query: any = {};

   if (timefilter) {
          const [year, month] = timefilter.split("-").map(Number);

          const startDate = new Date(Date.UTC(year, month - 1, 1));
          const endDate = new Date(Date.UTC(year, month, 1));

          query.createdAt = {
            $gte: startDate,
            $lt: endDate,
          };
        }

  
   if (searchId) {
      query.$or = [
        { orderid: searchId },
        { "address.fullname": { $regex: searchId, $options: "i" } },
      ];
    }

    

   
    if (filterstatus) {
      query.status = filterstatus;
    }

    const orderlist = await CustomerOrder.find(query)
      .populate({
        path: "products.productId",
        select: "-images",
      })
      .select(
        "_id productName createdAt status address orderid deliveryby totalprice"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalOrders = await CustomerOrder.countDocuments(query);

    if (!orderlist || orderlist.length === 0) {
      return NextResponse.json(
        { success: false, message: "Orders not found" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      orderlist,
      totalOrders,
      page,
      limit,
    });

  } catch (error) {
    return NextResponse.json({
        message:"Something went wrong"
       },{
        status:500
       })
  }
}
