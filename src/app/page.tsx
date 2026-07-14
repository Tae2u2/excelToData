import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-slate-800">공동구매 페이백 관리</h1>
        <p className="mt-2 text-sm text-slate-500">역할을 선택해 주세요.</p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/admin/settlements"
            className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700"
          >
            관리자로 접속
          </Link>
          <Link
            href="/staff/settlements"
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            실무자로 접속
          </Link>
        </div>
      </div>
    </div>
  );
}
