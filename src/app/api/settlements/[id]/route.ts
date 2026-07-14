import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UpdateSettlementInput } from "@/features/settlements/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const body: UpdateSettlementInput = await req.json();

  try {
    const settlement = await prisma.settlement.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(settlement);
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

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    await prisma.settlement.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
