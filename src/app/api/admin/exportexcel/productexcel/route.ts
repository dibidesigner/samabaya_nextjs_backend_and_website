import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { verifyToken } from "@/app/api/verifyToken";
import { connectDB } from "@/app/db/dbconnection";
import productModel from "@/app/api/Models/productShema";




export async function POST(req: NextRequest) {
  try {
    await verifyToken();
    await connectDB();

    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);


    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date range");
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);


    const products = await productModel.find({
        $or: [
          {
            createdAt: { $gte: start, $lte: end },
          },
          {
            updatedAt: { $gte: start, $lte: end },
          },
        ],
      });

    

    const today = new Date();

    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Inventory Audit");

    sheet.mergeCells("A1:M1");
    sheet.getCell("A1").value = "INVENTORY AUDIT REPORT — GROUPED BY PRODUCT";
    sheet.getCell("A1").font = {
        size: 12,
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
    sheet.getCell("A1").alignment = {
          horizontal: "center",
          vertical: "middle",
        };

    sheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2F5597" }, 
    };


    sheet.mergeCells("A2:M2");
    sheet.getCell("A2").value = "Each Product Shows all restocked batches identified by barcode. Yellow subtotal row consolidates all batches per product";
    sheet.getCell("A2").font = {
        size: 8,
        color: { argb: "bcc9dc" },
      };
    sheet.getCell("A2").alignment = {
          horizontal: "center",
          vertical: "middle",
        };

    sheet.getCell("A2").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2e75b6" }, 
    };


    const rowNumber = 3;

    sheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
    sheet.mergeCells(`D${rowNumber}:F${rowNumber}`);

    sheet.mergeCells(`J${rowNumber}:K${rowNumber}`);
    sheet.mergeCells(`L${rowNumber}:M${rowNumber}`);

    sheet.getCell(`B${rowNumber}`).value = "Report Period:";
    sheet.getCell(`D${rowNumber}`).value = `From ${startDate} To ${endDate}`;

    sheet.getCell(`J${rowNumber}`).value = "Generated On:";
    sheet.getCell(`L${rowNumber}`).value = formattedDate;


    sheet.getCell(`J${rowNumber}`).alignment = {
        horizontal: "right",
        vertical: "middle",
      };

      sheet.getCell(`L${rowNumber}`).alignment = {
        horizontal: "left",
        vertical: "middle",
      };

    [`B${rowNumber}`, `D${rowNumber}`, `J${rowNumber}`, `L${rowNumber}`].forEach(cellRef => {
        const cell = sheet.getCell(cellRef);

        cell.font = {
          size: 10,
          bold: cellRef === `B${rowNumber}` || cellRef === `J${rowNumber}`,
          color: { argb: "FFFFFFFF" },
        };
      });  

    for (let col = 1; col <= 13; col++) {
      sheet.getRow(rowNumber).getCell(col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2E75B6" },
      };
    }  


    const headerRowNumber = 4;

    sheet.columns = [
        { key: "productName", width: 25 },
        { key: "productCode", width: 15 },
        { key: "category", width: 18 },
        { key: "unit", width: 10 },
        { key: "barcode", width: 20 },
        { key: "restockDate", width: 15 },
        { key: "purchasePrice", width: 18 },
        { key: "sellingPrice", width: 18 },
        { key: "stockReceived", width: 15 },
        { key: "stockSold", width: 15 },
        { key: "remainingStock", width: 18 },
        { key: "batchValue", width: 18 },
        // { key: "profit", width: 15 },
      ];

    const headerRow = sheet.getRow(headerRowNumber);

    headerRow.values = [
      "Product Name",
      "Product Code",
      "Category",
      "Unit",
      "Barcode",
      "Restock Date",
      "Purchase Price (₹)",
      "Selling Price (₹)",
      "Stock Received",
      "Stock Sold",
      "Remaining Stock",
      "Batch Value (₹)",
      // "Profit Margin %",
    ];


    headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF2F5597" },
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

    sheet.getRow(headerRowNumber).height = 22;
    
    const groupedProducts: any = {};

    products.forEach((product) => {
      const key = product.productName;

      if (!groupedProducts[key]) {
        groupedProducts[key] = [];
      }

      groupedProducts[key].push(product);
    });

    let grandReceived = 0;
    let grandSold = 0;
    let grandRemaining = 0;
    let grandValue = 0;

    Object.keys(groupedProducts).forEach((productName) => {
        const items = groupedProducts[productName];


       
        // 🔢 Subtotal variables
        let totalOpening = 0;
        let totalReceived = 0;
        let totalSold = 0;
        let totalRemaining = 0;
        let totalValue = 0;
        let totalProfit = 0;

        


        items.forEach((item: any, index: number) => {

          const received = item.initialStock || 0;
          const remaining = item.stock || 0;
          const sold = Math.max(0, received - remaining);
          const value = remaining * item.price || 0;
          const profit = ((item.price - item.purchasePrice) / item.purchasePrice) * 100 || 0;

          // ➕ Add to totals
          totalReceived += received;
          totalSold += sold;
          totalRemaining += remaining;
          totalValue += value;
          totalProfit += profit;


          grandReceived += received;
          grandSold += sold;
          grandRemaining += remaining;
          grandValue += value;

          

       

          // 📦 Row
          const row = sheet.addRow({
            productName: index === 0 ? item.productName : "",
            productCode: index === 0 ? item.productCode : "",
            category: index === 0 ? item.productCategory : "",
            unit: index === 0 ? item.productUnit : "",

            barcode: item.barcode,
            restockDate: item.createdAt || item.updatedAt,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.price,
            stockReceived: received,
            stockSold: received - remaining,
            remainingStock: remaining,
            batchValue: value,
            profit: profit.toFixed(1) + "%",
          });
        });

        // 🟡 SUBTOTAL ROW
        const subRow = sheet.addRow({
          productName: `SUBTOTAL — ${productName}`,
          barcode: `${items.length} batch(es)`,
          openingStock: totalOpening,
          stockReceived: totalReceived,
          stockSold: totalSold,
          remainingStock: totalRemaining,
          batchValue: `₹${totalValue}`,
          // profit: (totalProfit / items.length).toFixed(1) + "%",
        });

        
            
    
    
    subRow.eachCell((cell) => {
        cell.font = { bold: true,color: { argb: "8c6f15" }, };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "fff2cc" }, // yellow
        };

      });

      sheet.mergeCells(`A${subRow.number}:D${subRow.number}`);

      })  

   const grandRow = sheet.addRow({
              productName: "GRAND TOTAL (ALL PRODUCTS)",
              stockReceived: grandReceived,
              stockSold: grandSold,
              remainingStock: grandRemaining,
              batchValue: `₹${grandValue}`,
            });

            // Merge like your design
            sheet.mergeCells(`A${grandRow.number}:G${grandRow.number}`);

            // Style (dark blue)
            grandRow.eachCell((cell) => {
              cell.font = {
                bold: true,
                color: { argb: "FFFFFFFF" },
              };

              cell.alignment = {
                horizontal: "center",
                vertical: "middle",
              };

              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF2F5597" },
              };

              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });

    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);

    const noteRow = sheet.addRow([
            "Blue/Grey rows = Individual batch (one barcode). Yellow rows = Subtotal across all batches of that product. Dark row = Grand total."
          ]);

          // Merge full width
          sheet.mergeCells(`A${noteRow.number}:M${noteRow.number}`);

          // ✅ Apply style ONLY to this row
          noteRow.getCell(1).font = {
            italic: true,
            size: 10,
            color: { argb: "FF666666" }, // gray text
          };

          noteRow.getCell(1).alignment = {
            horizontal: "left",
            vertical: "middle",
          };

          noteRow.getCell(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEDEDED" },
          };




    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          "attachment; filename=inventory_audit.xlsx",
      },
    });



    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate Excel" },
      { status: 500 }
    );
  }
}