import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import offLineOrderModel from "@/app/api/Models/offLineOrderSchema";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import { formatDateTime } from "@/app/api/extrafunction/formatDate";

export async function POST(req:NextRequest) {
  try {
    await verifyToken()
    await connectDB()
    const { startDate, endDate } = await req.json();


    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date required" },
        { status: 400 }
      );
    }

   

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (startDate === endDate) {
      end.setHours(23, 59, 59, 999);
    }

    const orders = await offLineOrderModel
      .find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
      .populate("product.product"); 


    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Orders");

    sheet.columns = [
      { header: "Order Id", key: "orderid", width: 20 },
      { header: "Customer Name", key: "customername", width: 20 },
      { header: "Mobile No", key: "mobile", width: 15 },
      { header: "Membership", key: "membership", width: 12 },
      { header: "Product Name", key: "productName", width: 25 },
      { header: "Price", key: "price", width: 10 },
      { header: "Qty", key: "qty", width: 10 },
      { header: "Total", key: "total", width: 12 },
      { header: "Order Total", key: "orderTotal", width: 15 },
      { header: "Billing Status", key: "billingDone", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];


    orders.forEach((order) => {
      order.product.forEach((item:any) => {
        sheet.addRow({
          orderid:order.orderid || order._id,
          customername: order.customername || "Not Available",
          mobile: order.cutomermobileno || "Not Provided",
          membership: order.customermembership ? "Yes" : "No",
          productName: item.product?.productName || "N/A",
          price: item.productPrice,
          qty: item.quantity,
          total: item.totalPrice,
          orderTotal: order.totalPrice,
          billingDone: order.billingDone ? "Yes" : "No",
          date:formatDateTime(order.createdAt),
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=orders.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate Excel" },
      { status: 500 }
    );
  }
}