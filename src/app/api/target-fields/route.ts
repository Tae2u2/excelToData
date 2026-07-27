import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateTargetFieldInput } from "@/features/target-fields/types";

export async function GET() {
  const targetFields = await prisma.targetField.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(targetFields);
}

export async function POST(req: Request) {
  const body: CreateTargetFieldInput = await req.json();

  if (!body.label?.trim()) {
    return NextResponse.json({ message: "항목 이름은 필수입니다." }, { status: 400 });
  }

  const customCount = await prisma.targetField.count({ where: { isBuiltIn: false } });

  try {
    const targetField = await prisma.targetField.create({
      data: {
        key: `custom_${randomUUID()}`,
        label: body.label.trim(),
        required: Boolean(body.required),
        isBuiltIn: false,
        sortOrder: 1000 + customCount,
      },
    });
    return NextResponse.json(targetField, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
