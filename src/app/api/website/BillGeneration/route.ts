import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import CustomerOrder from "../../Models/orderSchema";
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

    const items = await CustomerOrder.findById(id).populate({
      path: "products.productId",
      select: "productName productUnit productPrice stock productType",
    });

    if (!items) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const productRows = items.products
      .map(
        (p: any) => `
          <tr>
            <td style="padding:4px 0;">
              ${p.productId?.productName || "-"}
            </td>
            <td style="text-align:right;padding:4px 0;">
              ₹${p.price}
            </td>
            <td style="text-align:center;padding:4px 0;">
              ${p.quantity}
            </td>
            <td style="text-align:right;padding:4px 0;">
              ₹${p.price * p.quantity}
            </td>
          </tr>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: monospace;
              font-size: 12px;
            }

            .container {
              width: 72mm;
              margin: 0 auto;
              padding: 5px;
            }

            .center {
              text-align: center;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5px;
            }

            th {
              border-bottom: 1px dashed #000;
              padding-bottom: 4px;
            }

            td {
              word-break: break-word;
            }

            hr {
              border: none;
              border-top: 1px dashed #000;
              margin: 6px 0;
            }
          </style>
        </head>

        <body>
          <div class="container">

            <div class="center">
              <img src="${logoSrc}" width="60" />
            </div>

            <h2 class="center" style="margin:5px 0;">
              Samabaya Smart Bazar
            </h2>

            <h3 class="center" style="margin:5px 0;">
              Sisupalgarh Cooperative Society
            </h3>

            <hr />

            <div class="row">
              <span>Date</span>
              <span>${formatDateTime(items.createdAt)}</span>
            </div>

            <div class="row">
              <span>Invoice</span>
              <span>${items.orderid || items._id}</span>
            </div>

            ${items.address
        ? `
                <div class="row">
                  <span>Customer</span>
                  <span>${items.address.fullname}</span>
                </div>

                <div class="row">
                  <span>Mobile</span>
                  <span>${items.address.mobileno}</span>
                </div>
              `
        : ""
      }

            <hr />

            <table>
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

            <hr />

            <div class="row" style="font-weight:bold;">
              <span>Total Amount</span>
              <span>₹${items.totalprice}</span>
            </div>

            <hr />

            <div class="center">
              <p>Thank You Visit Again</p>
              <p>Bill By: Samabaya Smart Bazar</p>
            </div>

          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.NODE_ENV === "production"
          ? "/usr/bin/chromium"
          : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    const pdf = await page.pdf({
      width: "72mm",
      printBackground: true,
      margin: {
        top: "2mm",
        bottom: "2mm",
        left: "2mm",
        right: "2mm",
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice-${items.orderid || items._id}.pdf`,
      },
    });
  } catch (error) {

    return NextResponse.json(
      {
        message: "Failed to generate bill",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}