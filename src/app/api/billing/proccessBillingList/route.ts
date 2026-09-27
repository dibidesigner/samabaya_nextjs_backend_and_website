import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import offLineOrderModel from "../../Models/offLineOrderSchema"; 
import fs from "fs";
import path from "path";
import { formatDateTime } from "../../extrafunction/formatDate";
const logoPath = path.join(process.cwd(), "public/Demologo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");
const logoSrc = `data:image/png;base64,${logoBase64}`;

export async function POST(req: NextRequest) {
  try {

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Please Send Order ID" },
        { status: 400 }
      );
    }

    

    
    const items = await offLineOrderModel
      .findById(id)
      .populate({
        path: "product.product",
        select: "productName productUnit productPrice stock productType"
      });

    if (!items) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }


    

    const productRows = items.product
      .map(
        (p: any) => `
        <tr>
          <td>${p.product.productName}</td>
          <td style="text-align:right">${p.productPrice}</td>
          <td style="text-align:center">${ p.product.productType == "open" ? p.weight +"g": p.quantity} </td>
          <td>
            ${
              p.totalPrice ??
              (p.product.productType == "open"
                ? ( p.totalPrice ? p.totalPrice : p.productPrice * p.weight) / 1000
                : p.productPrice * (p.quantity || 1))
            }
          </td>
        </tr>
      `
      )
      .join("");

    const html = `
    <html>
        <head>
        
        </head>
                <div style="width:72mm;margin:5;font-family:monospace;font-size:12px">

                <div style="text-align:center">
                    <img src="${logoSrc}" width="60"/>
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
                    <span>${formatDateTime(items.createdAt)}</span>
                </div>

                <div style="display:flex;justify-content:space-between">
                    <span>Invoice</span>
                    <span>${items.orderid ? items.orderid : items._id}</span>
                </div>

                <hr/>

                <table width="100%" style="font-size:12px;border-collapse:collapse;margin:5">

                    <thead>
                    <tr>
                       <th align="left">Item</th>
                      <th align="right">Price</th>
                      <th align="center">Qty</th>
                      <th align="right">Total</th>
                    </tr>
                    </thead>

                    <tbody>
                    ${productRows}
                    </tbody>

                </table>

                <hr/>

                <div style="display:flex;justify-content:space-between;font-weight:bold">
                    <span>Total</span>
                    <span>${items.totalPrice}</span>
                </div>

                <hr/>

                <p style="text-align:center">Thank You Visit Again</p>
                <p style="text-align:center">Bill By: Samabaya Smart Bazar</p>

                </div>
                </body>
            </html>
    `;

    const browser = await puppeteer.launch({
        headless: true,
        executablePath:
          process.env.NODE_ENV === "production"
            ? "/usr/bin/chromium"
            : undefined,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage"
        ],
      });
    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
            width: "72mm",
            printBackground: true,
            margin: { top: "0mm", bottom: "0mm", left: "2mm", right: "2mm" },
            preferCSSPageSize: true
            });

    await browser.close();
    const pdfBuffer = Buffer.from(pdf);


    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice-${items._id}.pdf`,
      },
    });

  } catch (error) {

    return NextResponse.json(
      { message: "Failed to generate bill" },
      { status: 500 }
    );

  }
}