"use client";

import { UploadFlowProvider } from "@/features/excel-upload/uploadContext";
import { UploadFlowScreen } from "@/features/excel-upload/components/UploadFlowScreen";

export default function ExcelUploadPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-800">엑셀 일괄 등록</h2>
      <UploadFlowProvider>
        <UploadFlowScreen />
      </UploadFlowProvider>
    </div>
  );
}
