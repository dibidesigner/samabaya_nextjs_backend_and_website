import bcrypt from 'bcryptjs';
import UserModel from '../../Models/userSchema'; // Import the Mongoose model we created
import { connectDB } from '@/app/db/dbconnection';// Assuming you have a DB connection utility

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, email, mobile, password } = body;


    if (!fullName || !email || !mobile || !password) {
      return Response.json(
        { error: 'Full name, email, mobile and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      let errorMessage = 'User already exists';
      if (existingUser.email === email) errorMessage = 'Email already in use';
      if (existingUser.mobile === mobile) errorMessage = 'Mobile number already in use';

      return Response.json(
        { error: errorMessage },
        { status: 409 }
      );
    }

    const hashpassword = await bcrypt.hash(password, 10)


    const newUser = await UserModel.create({
      fullname: fullName,
      email,
      mobile,
      password: hashpassword,
      active: true,
      userRole: "admin"
    });



    await newUser.save();



    return Response.json(
      {
        success: true,
        message: 'User registered successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}