import { describe, expect, it } from "vitest";
import { filterRows, uniqueColumnValues } from "./filterRows";

interface Row {
  category: string;
  stock: number;
}

const rows: Row[] = [
  { category: "커피", stock: 10 },
  { category: "음료", stock: 20 },
  { category: "커피", stock: 30 },
];

describe("filterRows", () => {
  it("returns all rows when there are no active filters", () => {
    expect(filterRows(rows, {})).toEqual(rows);
  });

  it("ignores empty filter arrays", () => {
    expect(filterRows(rows, { category: [] })).toEqual(rows);
  });

  it("keeps rows matching a single-column filter", () => {
    expect(filterRows(rows, { category: ["커피"] })).toEqual([rows[0], rows[2]]);
  });

  it("applies multiple column filters together (AND)", () => {
    expect(filterRows(rows, { category: ["커피"], stock: [30] })).toEqual([rows[2]]);
  });
});

describe("uniqueColumnValues", () => {
  it("returns unique, non-empty values for a column", () => {
    expect(uniqueColumnValues(rows, "category")).toEqual(["커피", "음료"]);
  });
});
