import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateSettlementInput } from "@/features/settlements/types";

export async function GET() {
  const settlements = await prisma.settlement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(settlements);
}

export async function POST(req: Request) {
  const body: CreateSettlementInput = await req.json();

  try {
    const settlement = await prisma.settlement.create({ data: body });
    return NextResponse.json(settlement, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { message: "이미 등록된 주문번호입니다 (동일 캠페인 내 중복)." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
