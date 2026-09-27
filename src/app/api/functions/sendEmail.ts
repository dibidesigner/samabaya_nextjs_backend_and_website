import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string,html?: string ) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use SMTP { host, port, auth }
      auth: {
        user: "dibihembramaashdit@gmail.com",
        pass: "hdjb otmg jqhl foqx",
      },
    });

    const mailOptions = {
      from: `"cooperativestore.com" <dibihembramaashdit@gmail.com>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
   return NextResponse.json({
           message:"Something went wrong"
          },{
           status:500
          })
  }
}
