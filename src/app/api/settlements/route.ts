import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateSettlementInput } from "@/features/settlements/types";

const DEFAULT_PAGE_SIZE = 20;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE);
  const groupIdParam = searchParams.get("groupId");
  const where = groupIdParam ? { groupId: Number(groupIdParam) } : undefined;

  const [data, total] = await Promise.all([
    prisma.settlement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { group: { select: { id: true, name: true } } },
    }),
    prisma.settlement.count({ where }),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

export async function POST(req: Request) {
  const body: CreateSettlementInput = await req.json();

  try {
    const settlement = await prisma.settlement.create({
      data: { ...body, extraFields: body.extraFields ?? undefined },
      include: { group: { select: { id: true, name: true } } },
    });
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
