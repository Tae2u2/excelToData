import { describe, expect, it } from "vitest";
import {
  DEFAULT_HEADER_MAP,
  getDuplicateFieldAssignments,
  getMissingRequiredFields,
  suggestMapping,
} from "./fieldMapping";
import type { ImportMappingProfile } from "./types";

const DEFAULT_HEADERS = Object.keys(DEFAULT_HEADER_MAP);

function buildProfile(overrides: Partial<ImportMappingProfile> = {}): ImportMappingProfile {
  return {
    id: 1,
    name: "테스트 프로필",
    mapping: { 주문번호: "orderNo", 고객명: "buyerName" },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("suggestMapping", () => {
  it("falls back to the default header map when no saved profile matches", () => {
    const { mapping, matchedProfileName } = suggestMapping(DEFAULT_HEADERS, []);
    expect(matchedProfileName).toBeNull();
    expect(mapping["주문번호"]).toBe("orderNo");
    expect(mapping["페이백 금액"]).toBe("paybackAmount");
  });

  it("leaves unrecognized headers unmapped", () => {
    const { mapping } = suggestMapping(["알수없는열"], []);
    expect(mapping["알수없는열"]).toBeNull();
  });

  it("auto-applies a saved profile when its header set matches exactly", () => {
    const profile = buildProfile({ mapping: { 주문코드: "orderNo", 고객명: "buyerName" } });
    const { mapping, matchedProfileName } = suggestMapping(["주문코드", "고객명"], [profile]);
    expect(matchedProfileName).toBe("테스트 프로필");
    expect(mapping["주문코드"]).toBe("orderNo");
    expect(mapping["고객명"]).toBe("buyerName");
  });

  it("ignores a saved profile whose header set only partially overlaps", () => {
    const profile = buildProfile({ mapping: { 주문코드: "orderNo", 고객명: "buyerName" } });
    const { matchedProfileName } = suggestMapping(["주문코드", "고객명", "추가열"], [profile]);
    expect(matchedProfileName).toBeNull();
  });

  it("matches headers loosely across whitespace differences", () => {
    const { mapping } = suggestMapping(["구매자연락처"], []);
    expect(mapping["구매자연락처"]).toBe("buyerPhone");
  });
});

describe("getMissingRequiredFields", () => {
  it("returns no missing fields when every required field is mapped", () => {
    const { mapping } = suggestMapping(DEFAULT_HEADERS, []);
    expect(getMissingRequiredFields(mapping)).toEqual([]);
  });

  it("reports required fields that have no mapped header", () => {
    const missing = getMissingRequiredFields({ 주문번호: "orderNo" });
    const missingFields = missing.map((f) => f.field);
    expect(missingFields).toContain("campaignName");
    expect(missingFields).not.toContain("orderNo");
  });

  it("does not flag optional fields as missing", () => {
    const missing = getMissingRequiredFields({});
    expect(missing.map((f) => f.field)).not.toContain("buyerPhone");
    expect(missing.map((f) => f.field)).not.toContain("memo");
  });
});

describe("getDuplicateFieldAssignments", () => {
  it("reports fields mapped from more than one header", () => {
    const duplicates = getDuplicateFieldAssignments({ 주문번호: "orderNo", 주문코드: "orderNo" });
    expect(duplicates).toEqual([{ field: "orderNo", headers: ["주문번호", "주문코드"] }]);
  });

  it("returns no duplicates for a clean one-to-one mapping", () => {
    const { mapping } = suggestMapping(Object.keys(DEFAULT_HEADER_MAP), []);
    expect(getDuplicateFieldAssignments(mapping)).toEqual([]);
  });
});
