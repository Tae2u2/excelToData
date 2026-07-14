-- CreateTable
CREATE TABLE "Settlement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNo" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "purchaseAmount" INTEGER NOT NULL,
    "paybackAmount" INTEGER NOT NULL,
    "paybackStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "bankName" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "bankAccountHolder" TEXT NOT NULL,
    "memo" TEXT,
    "rejectedReason" TEXT,
    "sourceFile" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Settlement_paybackStatus_idx" ON "Settlement"("paybackStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_orderNo_campaignName_key" ON "Settlement"("orderNo", "campaignName");
