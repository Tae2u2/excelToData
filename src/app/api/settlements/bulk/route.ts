import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BulkValidationError } from "@/lib/errors";
import type { CreateSettlementInput } from "@/features/settlements/types";

interface BulkSubmitRow {
  rowNumber: number;
  data: CreateSettlementInput;
}

interface BulkSubmitRequest {
  rows: BulkSubmitRow[];
}

export async function POST(req: Request) {
  const body: BulkSubmitRequest = await req.json();

  if (!body.rows || body.rows.length === 0) {
    return NextResponse.json(
      { ok: false, failures: [{ rowNumber: 0, reason: "제출할 데이터가 없습니다." }] },
      { status: 400 }
    );
  }

  try {
    const createdCount = await prisma.$transaction(async (tx) => {
      const existing = await tx.settlement.findMany({
        where: {
          OR: body.rows.map((r) => ({
            orderNo: r.data.orderNo,
            campaignName: r.data.campaignName,
          })),
        },
        select: { orderNo: true, campaignName: true },
      });
      const existingKeys = new Set(existing.map((e) => `${e.orderNo}|${e.campaignName}`));

      const failures = body.rows
        .filter((r) => existingKeys.has(`${r.data.orderNo}|${r.data.campaignName}`))
        .map((r) => ({
          rowNumber: r.rowNumber,
          reason: `이미 등록된 주문번호입니다 (${r.data.orderNo}).`,
        }));

      if (failures.length > 0) {
        throw new BulkValidationError(failures);
      }

      await tx.settlement.createMany({
        data: body.rows.map((r) => ({ ...r.data, extraFields: r.data.extraFields ?? undefined })),
      });
      return body.rows.length;
    });

    return NextResponse.json({ ok: true, createdCount });
  } catch (err) {
    if (err instanceof BulkValidationError) {
      return NextResponse.json({ ok: false, failures: err.failures }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json(
      { ok: false, failures: [{ rowNumber: 0, reason: "서버 오류가 발생했습니다." }] },
      { status: 500 }
    );
  }
}
