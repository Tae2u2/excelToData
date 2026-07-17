import { describe, expect, it } from "vitest";
import { nextSortDirection, sortRows } from "./sortRows";

interface Row {
  name: string;
  amount: number;
}

const rows: Row[] = [
  { name: "banana", amount: 30 },
  { name: "apple", amount: 10 },
  { name: "cherry", amount: 20 },
];

describe("sortRows", () => {
  it("returns rows unchanged when no field is set", () => {
    expect(sortRows(rows, null, "asc")).toBe(rows);
  });

  it("returns rows unchanged when direction is null", () => {
    expect(sortRows(rows, "name", null)).toBe(rows);
  });

  it("sorts numeric fields ascending", () => {
    expect(sortRows(rows, "amount", "asc").map((r) => r.amount)).toEqual([10, 20, 30]);
  });

  it("sorts numeric fields descending", () => {
    expect(sortRows(rows, "amount", "desc").map((r) => r.amount)).toEqual([30, 20, 10]);
  });

  it("sorts string fields ascending", () => {
    expect(sortRows(rows, "name", "asc").map((r) => r.name)).toEqual(["apple", "banana", "cherry"]);
  });

  it("does not mutate the original array", () => {
    sortRows(rows, "amount", "asc");
    expect(rows.map((r) => r.amount)).toEqual([30, 10, 20]);
  });
});

describe("nextSortDirection", () => {
  it("cycles asc -> desc -> null -> asc", () => {
    expect(nextSortDirection(null)).toBe("asc");
    expect(nextSortDirection("asc")).toBe("desc");
    expect(nextSortDirection("desc")).toBe(null);
  });
});
