import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateImportMappingInput } from "@/features/excel-upload/types";

export async function GET() {
  const mappings = await prisma.importMapping.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(mappings);
}

export async function POST(req: Request) {
  const body: CreateImportMappingInput = await req.json();

  if (!body.name?.trim() || !body.mapping || Object.keys(body.mapping).length === 0) {
    return NextResponse.json({ message: "매핑 프로필 이름과 매핑 내용은 필수입니다." }, { status: 400 });
  }

  try {
    const importMapping = await prisma.importMapping.create({
      data: { name: body.name.trim(), mapping: body.mapping },
    });
    return NextResponse.json(importMapping, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { message: "이미 같은 이름의 매핑 프로필이 있습니다." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
