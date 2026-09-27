import { connectDB } from "@/app/db/dbconnection"
import userModel from "../../Models/userSchema"
import { NextResponse } from "next/server"
import { verifyToken } from "../../verifyToken"


export async function POST(req:Request){
   
   try {
      await verifyToken()
      await connectDB()

      const body = await req.json()



      const {designation,searchName} = body

      
      
      if(searchName){
         const users = await userModel.find({fullname:searchName}).select("fullname mobile email active userRole profileImage _id").sort({ _id: -1 });
         return NextResponse.json({
            "users":users
          },
         {
            status:200
         })
      }

      if(designation !== "All"){
          const users = await userModel.find({userRole:designation}).select("fullname mobile email active userRole profileImage _id").sort({ _id: -1 });
          return NextResponse.json({
            "users":users
          },
         {
            status:200
         })
      }
    
      const users = await userModel.find().select("fullname mobile email active userRole profileImage _id").sort({ _id: -1 });

 

      if (!users){
         return NextResponse.json({
               "success":false,
               "message":"No Users found"
         },
         {
               status:400
         })
         }
 


      return NextResponse.json({
         "success":true,
         "message" : `${users.length} numbers user are there`,
         "users":users
      },{
         status:200
      })   
      
      


   } catch (error) {
     return NextResponse.json({
      "message":"Something went Wrong"
     },
   {
      status:500
   })
   }
}