-- CreateTable
CREATE TABLE "SettlementGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settlement" (
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
    "extraFields" JSONB,
    "rejectedReason" TEXT,
    "sourceFile" TEXT,
    "paidAt" DATETIME,
    "groupId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settlement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SettlementGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Settlement" ("bankAccountHolder", "bankAccountNumber", "bankName", "buyerName", "buyerPhone", "campaignName", "createdAt", "extraFields", "id", "memo", "orderNo", "paidAt", "paybackAmount", "paybackStatus", "purchaseAmount", "rejectedReason", "sourceFile", "updatedAt") SELECT "bankAccountHolder", "bankAccountNumber", "bankName", "buyerName", "buyerPhone", "campaignName", "createdAt", "extraFields", "id", "memo", "orderNo", "paidAt", "paybackAmount", "paybackStatus", "purchaseAmount", "rejectedReason", "sourceFile", "updatedAt" FROM "Settlement";
DROP TABLE "Settlement";
ALTER TABLE "new_Settlement" RENAME TO "Settlement";
CREATE INDEX "Settlement_paybackStatus_idx" ON "Settlement"("paybackStatus");
CREATE INDEX "Settlement_groupId_idx" ON "Settlement"("groupId");
CREATE UNIQUE INDEX "Settlement_orderNo_campaignName_key" ON "Settlement"("orderNo", "campaignName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SettlementGroup_name_key" ON "SettlementGroup"("name");
