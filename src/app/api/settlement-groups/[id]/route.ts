import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UpdateSettlementGroupInput } from "@/features/settlement-groups/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const groupId = Number(id);

  const [group, aggregate] = await Promise.all([
    prisma.settlementGroup.findUnique({
      where: { id: groupId },
      include: { _count: { select: { settlements: true } } },
    }),
    prisma.settlement.aggregate({
      where: { groupId },
      _sum: { purchaseAmount: true, paybackAmount: true },
    }),
  ]);

  if (!group) {
    return NextResponse.json({ message: "그룹을 찾을 수 없습니다." }, { status: 404 });
  }

  const { _count, ...rest } = group;
  return NextResponse.json({
    ...rest,
    settlementCount: _count.settlements,
    totalPurchaseAmount: aggregate._sum.purchaseAmount ?? 0,
    totalPaybackAmount: aggregate._sum.paybackAmount ?? 0,
  });
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const body: UpdateSettlementGroupInput = await req.json();

  const existing = await prisma.settlementGroup.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ message: "그룹을 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const group = await prisma.settlementGroup.update({
      where: { id: Number(id) },
      data: {
        name: body.name?.trim(),
        memo: body.memo === undefined ? undefined : body.memo?.trim() || null,
      },
    });
    return NextResponse.json(group);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ message: "이미 존재하는 그룹 이름입니다." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;

  const existing = await prisma.settlementGroup.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ message: "그룹을 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    await prisma.settlementGroup.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
