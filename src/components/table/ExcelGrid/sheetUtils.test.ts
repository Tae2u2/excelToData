import { describe, expect, it } from "vitest";
import { buildSheetFromData, getColumnLetter } from "./sheetUtils";

describe("getColumnLetter", () => {
  it("converts single-letter indices", () => {
    expect(getColumnLetter(0)).toBe("A");
    expect(getColumnLetter(1)).toBe("B");
    expect(getColumnLetter(25)).toBe("Z");
  });

  it("converts double-letter indices", () => {
    expect(getColumnLetter(26)).toBe("AA");
    expect(getColumnLetter(27)).toBe("AB");
    expect(getColumnLetter(51)).toBe("AZ");
  });
});

describe("buildSheetFromData", () => {
  const columns = [
    { title: "이름", dataIndex: "name", key: "name" },
    { title: "금액", dataIndex: "amount", key: "amount" },
  ];

  it("builds a header row from column titles", () => {
    const sheet = buildSheetFromData([], columns);
    expect(sheet.A1).toEqual({ value: "이름" });
    expect(sheet.B1).toEqual({ value: "금액" });
  });

  it("builds data rows starting at row 2", () => {
    const sheet = buildSheetFromData([{ name: "홍길동", amount: 1000 }], columns);
    expect(sheet.A2).toEqual({ value: "홍길동" });
    expect(sheet.B2).toEqual({ value: "1000" });
  });

  it("fills missing values with an empty string", () => {
    const sheet = buildSheetFromData([{ name: "홍길동" }], columns);
    expect(sheet.B2).toEqual({ value: "" });
  });
});
