import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import offLineOrderModel from "../../Models/offLineOrderSchema";

export async function POST(req: NextRequest) {
  try {

    const id  = await req.json();
  

    if (!id) {
      return NextResponse.json(
        { message: "Please Send Order ID" },
        { status: 400 }
      );
    }

    const items = await offLineOrderModel
      .findById(id)
      .populate("product.product");

    if (!items) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // HTML Template
    const html = `
    <div style="width:300px;margin:auto;font-family:monospace;font-size:12px">

      <div style="text-align:center">
        <img src="https://dummyimage.com/100x50/000/fff" width="60"/>
      </div>

      <h2 style="text-align:center;font-weight:bold">
        Samabaya Smart Bazar
      </h2>

      <h3 style="text-align:center;font-weight:bold">
        Sisupalgarh Cooperative Society
      </h3>

      <hr/>

      <div style="display:flex;justify-content:space-between">
        <span>Date</span>
        <span>${new Date(items.createdAt).toLocaleString()}</span>
      </div>

      <div style="display:flex;justify-content:space-between">
        <span>Invoice</span>
        <span>${items._id}</span>
      </div>

      <hr/>

      <table width="100%" style="font-size:12px">
        <thead>
          <tr>
            <th align="left">Item</th>
            <th align="right">Price</th>
            <th align="center">Qty</th>
            <th align="center">Type</th>
            <th align="right">Total</th>
          </tr>
        </thead>

        <tbody>
          ${items.product.map((p:any)=>`
            <tr>
              <td>${p.product.productName}</td>
              <td align="right">₹${p.productPrice}</td>
              <td align="center">${p.quantity}</td>
              <td align="center">${p.productUnit}</td>
              <td align="right">₹${p.productUnit !== "kg" ? Number(p.productPrice) * Number(p.quantity) : (Number(p.productPrice)/1000)*Number(p.quantity) }</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <hr/>

      <div style="display:flex;justify-content:space-between;font-weight:bold">
        <span>Total</span>
        <span>₹${items.totalPrice}</span>
      </div>

      <hr/>

      <p style="text-align:center">Thank You Visit Again</p>
      <p style="text-align:center">Bill By: Samabaya Smart Bazar</p>

    </div>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

   const pdf = await page.pdf({
        width: "auto",
        printBackground: true,
        margin: {
            top: "0",
            bottom: "0",
            left: 5,
            right: 5
        },
        preferCSSPageSize: true
        });


    await browser.close();

    const pdfBuffer = Buffer.from(pdf);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=bill.pdf"
      }
    });

  } catch (error) {

    return NextResponse.json({
      message: "Failed to Bill"
    });

  }
}