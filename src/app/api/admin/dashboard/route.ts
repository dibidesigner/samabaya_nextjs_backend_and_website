import { NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";
import userModel from "../../Models/userSchema";
import productModel from "../../Models/productShema";
import { connectDB } from "@/app/db/dbconnection";
import CustomerOrder from "../../Models/orderSchema";
import offLineOrderModel from "../../Models/offLineOrderSchema";


export async function POST() {
  try {
    await verifyToken();
    await connectDB();

    const [users, staff, orders, products] = await Promise.all([
      userModel.find({ userRole: { $ne: "staff" } }),
      userModel.find({ userRole: "staff" }),
      CustomerOrder.find(),
      productModel.find(),
    ]);

    const countproductsum = await productModel.find({productType:"weight"}).select("stock")

    const openproductsum = await productModel.find({productType:"open"}).select("stock")

    const totalOfflineOrder = await offLineOrderModel.find()


    
    let totalWeightStock = 0;
    let totalOpenStock = 0;

   
    countproductsum.forEach(element => {
      totalWeightStock += element.stock
    });
    

    openproductsum.forEach(element => {
      totalOpenStock += element.stock
    });
    

    return NextResponse.json({
      totalUsers: users.length | 0,
      staff: staff.length | 0,
      totalOrders: orders.length | 0,
      totalProducts: products.length | 0,
      totalWeightStock,  
      totalOpenStock, 
      orders: orders,
      totalOfflineOrder : totalOfflineOrder.length | 0
    });

  } catch (error) {
    return NextResponse.json({
      message:"Something went wrong"
    });
  }
}