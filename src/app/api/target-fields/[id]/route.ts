import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UpdateTargetFieldInput } from "@/features/target-fields/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const body: UpdateTargetFieldInput = await req.json();

  const existing = await prisma.targetField.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ message: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  const data: UpdateTargetFieldInput = {
    label: body.label?.trim(),
    sortOrder: body.sortOrder,
    required: body.required,
  };

  try {
    const targetField = await prisma.targetField.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(targetField);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;

  const existing = await prisma.targetField.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ message: "항목을 찾을 수 없습니다." }, { status: 404 });
  }
  if (existing.isBuiltIn) {
    return NextResponse.json({ message: "기본 항목은 삭제할 수 없습니다." }, { status: 400 });
  }

  try {
    await prisma.targetField.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
