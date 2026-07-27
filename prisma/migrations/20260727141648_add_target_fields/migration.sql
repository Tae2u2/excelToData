-- AlterTable
ALTER TABLE "Settlement" ADD COLUMN "extraFields" JSONB;

-- CreateTable
CREATE TABLE "TargetField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TargetField_key_key" ON "TargetField"("key");

-- Seed built-in target fields
INSERT INTO "TargetField" ("key", "label", "required", "isBuiltIn", "sortOrder", "updatedAt") VALUES
('orderNo', '주문번호', true, true, 0, CURRENT_TIMESTAMP),
('campaignName', '캠페인명', true, true, 1, CURRENT_TIMESTAMP),
('buyerName', '구매자명', true, true, 2, CURRENT_TIMESTAMP),
('buyerPhone', '구매자 연락처', false, true, 3, CURRENT_TIMESTAMP),
('purchaseAmount', '구매금액', true, true, 4, CURRENT_TIMESTAMP),
('paybackAmount', '페이백 금액', true, true, 5, CURRENT_TIMESTAMP),
('bankName', '은행명', true, true, 6, CURRENT_TIMESTAMP),
('bankAccountNumber', '계좌번호', true, true, 7, CURRENT_TIMESTAMP),
('bankAccountHolder', '예금주', true, true, 8, CURRENT_TIMESTAMP),
('memo', '메모', false, true, 9, CURRENT_TIMESTAMP);
