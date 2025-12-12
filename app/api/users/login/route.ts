import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/src/lib/mongodb";
import type { UserDocument } from "@/src/types/user";
import { loginSchema, LoginInput } from "@/src/lib/validation/authSchemas";
import type { AuthUser } from "@/src/lib/auth";

const SESSION_COOKIE_NAME = "jobtracker_user";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten();
      return NextResponse.json(
        {
          message: "입력값을 확인해주세요.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data as LoginInput;

    const { db } = await connectToDatabase();
    const users = db.collection<UserDocument>("users");

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 쿠키
    const authUser: AuthUser = {
      id: user._id?.toString() || "",
      name: user.name,
      email: user.email,
    };
    
    const res = NextResponse.json(
      {
        message: "로그인에 성공했습니다.",
        user: authUser,
      },
      { status: 200 }
    );

    res.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(authUser), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return res;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
