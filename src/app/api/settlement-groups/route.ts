import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateSettlementGroupInput } from "@/features/settlement-groups/types";

export async function GET() {
  const groups = await prisma.settlementGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { settlements: true } } },
  });

  return NextResponse.json(
    groups.map(({ _count, ...group }) => ({
      ...group,
      settlementCount: _count.settlements,
    })),
  );
}

export async function POST(req: Request) {
  const body: CreateSettlementGroupInput = await req.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ message: "그룹 이름은 필수입니다." }, { status: 400 });
  }

  try {
    const group = await prisma.settlementGroup.create({
      data: { name: body.name.trim(), memo: body.memo?.trim() || null },
    });
    return NextResponse.json({ ...group, settlementCount: 0 }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ message: "이미 존재하는 그룹 이름입니다." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
