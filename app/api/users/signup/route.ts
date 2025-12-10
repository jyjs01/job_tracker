import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/src/lib/mongodb";
import type { UserDocument } from "@/src/types/user";
import { signupSchema, SignupInput } from "@/src/lib/validation/authSchemas";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = signupSchema.safeParse(json);

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten();
      return NextResponse.json(
        {
          message: "입력값을 확인해주세요.",
          errors: fieldErrors, // { name?: string[], email?: string[], ... }
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data as SignupInput;

    const { db } = await connectToDatabase();
    const users = db.collection<UserDocument>("users");

    // 이메일 중복 체크
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 409 }
      );
    }

    // 비밀번호 해시
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();

    const result = await users.insertOne({
      name,
      email,
      password_hash: passwordHash,
      created_at: now,
    });

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: {
          id: result.insertedId.toString(),
          name,
          email,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
