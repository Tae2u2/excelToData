import { PrismaClient, PaybackStatus } from "@prisma/client";

const prisma = new PrismaClient();

const CAMPAIGNS = ["2026년 1월 공동구매", "2026년 2월 공동구매"];

const SAMPLE_SETTLEMENTS = [
  { orderNo: "ORD-0001", campaignName: CAMPAIGNS[0], buyerName: "김민준", buyerPhone: "010-1111-2222", purchaseAmount: 89000, paybackAmount: 8900, paybackStatus: PaybackStatus.PAID, bankName: "국민은행", bankAccountNumber: "123456-01-123456", bankAccountHolder: "김민준", paidAt: new Date("2026-01-10") },
  { orderNo: "ORD-0002", campaignName: CAMPAIGNS[0], buyerName: "이서연", buyerPhone: "010-2222-3333", purchaseAmount: 125000, paybackAmount: 12500, paybackStatus: PaybackStatus.PAID, bankName: "신한은행", bankAccountNumber: "110-222-333444", bankAccountHolder: "이서연", paidAt: new Date("2026-01-11") },
  { orderNo: "ORD-0003", campaignName: CAMPAIGNS[0], buyerName: "박도윤", buyerPhone: "010-3333-4444", purchaseAmount: 45000, paybackAmount: 4500, paybackStatus: PaybackStatus.PENDING, bankName: "우리은행", bankAccountNumber: "1002-333-444555", bankAccountHolder: "박도윤" },
  { orderNo: "ORD-0004", campaignName: CAMPAIGNS[0], buyerName: "최지우", buyerPhone: "010-4444-5555", purchaseAmount: 210000, paybackAmount: 21000, paybackStatus: PaybackStatus.PENDING, bankName: "하나은행", bankAccountNumber: "555-666666-777", bankAccountHolder: "최지우" },
  { orderNo: "ORD-0005", campaignName: CAMPAIGNS[0], buyerName: "정하윤", buyerPhone: "010-5555-6666", purchaseAmount: 76000, paybackAmount: 7600, paybackStatus: PaybackStatus.REJECTED, bankName: "카카오뱅크", bankAccountNumber: "3333-01-1234567", bankAccountHolder: "정하윤", rejectedReason: "계좌 정보 불일치" },
  { orderNo: "ORD-0006", campaignName: CAMPAIGNS[0], buyerName: "강서준", buyerPhone: "010-6666-7777", purchaseAmount: 98000, paybackAmount: 9800, paybackStatus: PaybackStatus.PAID, bankName: "국민은행", bankAccountNumber: "123456-02-234567", bankAccountHolder: "강서준", paidAt: new Date("2026-01-12") },
  { orderNo: "ORD-0007", campaignName: CAMPAIGNS[0], buyerName: "조은우", buyerPhone: "010-7777-8888", purchaseAmount: 152000, paybackAmount: 15200, paybackStatus: PaybackStatus.PENDING, bankName: "신한은행", bankAccountNumber: "110-333-444555", bankAccountHolder: "조은우" },
  { orderNo: "ORD-0008", campaignName: CAMPAIGNS[0], buyerName: "윤아린", buyerPhone: "010-8888-9999", purchaseAmount: 63000, paybackAmount: 6300, paybackStatus: PaybackStatus.PENDING, bankName: "우리은행", bankAccountNumber: "1002-444-555666", bankAccountHolder: "윤아린" },
  { orderNo: "ORD-0001", campaignName: CAMPAIGNS[1], buyerName: "장하은", buyerPhone: "010-9999-0000", purchaseAmount: 132000, paybackAmount: 13200, paybackStatus: PaybackStatus.PAID, bankName: "하나은행", bankAccountNumber: "555-777777-888", bankAccountHolder: "장하은", paidAt: new Date("2026-02-05") },
  { orderNo: "ORD-0002", campaignName: CAMPAIGNS[1], buyerName: "임도현", buyerPhone: "010-1010-2020", purchaseAmount: 87000, paybackAmount: 8700, paybackStatus: PaybackStatus.PENDING, bankName: "카카오뱅크", bankAccountNumber: "3333-02-2345678", bankAccountHolder: "임도현" },
  { orderNo: "ORD-0003", campaignName: CAMPAIGNS[1], buyerName: "한소율", buyerPhone: "010-2020-3030", purchaseAmount: 199000, paybackAmount: 19900, paybackStatus: PaybackStatus.PENDING, bankName: "국민은행", bankAccountNumber: "123456-03-345678", bankAccountHolder: "한소율" },
  { orderNo: "ORD-0004", campaignName: CAMPAIGNS[1], buyerName: "오지호", buyerPhone: "010-3030-4040", purchaseAmount: 54000, paybackAmount: 5400, paybackStatus: PaybackStatus.REJECTED, bankName: "신한은행", bankAccountNumber: "110-444-555666", bankAccountHolder: "오지호", rejectedReason: "중복 신청" },
  { orderNo: "ORD-0005", campaignName: CAMPAIGNS[1], buyerName: "신유나", buyerPhone: "010-4040-5050", purchaseAmount: 143000, paybackAmount: 14300, paybackStatus: PaybackStatus.PAID, bankName: "우리은행", bankAccountNumber: "1002-555-666777", bankAccountHolder: "신유나", paidAt: new Date("2026-02-08") },
  { orderNo: "ORD-0006", campaignName: CAMPAIGNS[1], buyerName: "배주원", buyerPhone: "010-5050-6060", purchaseAmount: 76500, paybackAmount: 7650, paybackStatus: PaybackStatus.PENDING, bankName: "하나은행", bankAccountNumber: "555-888888-999", bankAccountHolder: "배주원" },
  { orderNo: "ORD-0007", campaignName: CAMPAIGNS[1], buyerName: "홍시윤", buyerPhone: "010-6060-7070", purchaseAmount: 112000, paybackAmount: 11200, paybackStatus: PaybackStatus.PENDING, bankName: "카카오뱅크", bankAccountNumber: "3333-03-3456789", bankAccountHolder: "홍시윤" },
];

async function main() {
  await prisma.settlement.deleteMany();
  await prisma.settlement.createMany({ data: SAMPLE_SETTLEMENTS });
  console.log(`Seeded ${SAMPLE_SETTLEMENTS.length} settlements.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
