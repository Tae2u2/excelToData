import type { RawSettlementRow } from "./validation/types";
import type { ImportMappingProfile } from "./types";

export interface TargetFieldConfig {
  field: keyof RawSettlementRow;
  label: string;
  required: boolean;
}

export const TARGET_FIELDS: TargetFieldConfig[] = [
  { field: "orderNo", label: "주문번호", required: true },
  { field: "campaignName", label: "캠페인명", required: true },
  { field: "buyerName", label: "구매자명", required: true },
  { field: "buyerPhone", label: "구매자 연락처", required: false },
  { field: "purchaseAmount", label: "구매금액", required: true },
  { field: "paybackAmount", label: "페이백 금액", required: true },
  { field: "bankName", label: "은행명", required: true },
  { field: "bankAccountNumber", label: "계좌번호", required: true },
  { field: "bankAccountHolder", label: "예금주", required: true },
  { field: "memo", label: "메모", required: false },
];

export const DEFAULT_HEADER_MAP: Record<string, keyof RawSettlementRow> = {
  주문번호: "orderNo",
  캠페인명: "campaignName",
  구매자명: "buyerName",
  "구매자 연락처": "buyerPhone",
  구매금액: "purchaseAmount",
  "페이백 금액": "paybackAmount",
  은행명: "bankName",
  계좌번호: "bankAccountNumber",
  예금주: "bankAccountHolder",
  메모: "memo",
};

export function normalizeHeader(header: string): string {
  return header.trim().replace(/\s+/g, "");
}

export type HeaderFieldMapping = Record<string, keyof RawSettlementRow | null>;

export interface SuggestMappingResult {
  mapping: HeaderFieldMapping;
  matchedProfileName: string | null;
}

function findMatchingProfile(
  headers: string[],
  savedProfiles: ImportMappingProfile[]
): ImportMappingProfile | null {
  const normalizedHeaders = new Set(headers.map(normalizeHeader));

  for (const profile of savedProfiles) {
    const profileHeaders = Object.keys(profile.mapping).map(normalizeHeader);
    if (profileHeaders.length !== normalizedHeaders.size) continue;
    if (profileHeaders.every((h) => normalizedHeaders.has(h))) {
      return profile;
    }
  }
  return null;
}

export function applyProfile(headers: string[], profile: ImportMappingProfile): HeaderFieldMapping {
  const byNormalizedHeader = new Map(
    Object.entries(profile.mapping).map(([header, field]) => [
      normalizeHeader(header),
      field as keyof RawSettlementRow,
    ])
  );
  const mapping: HeaderFieldMapping = {};
  for (const header of headers) {
    mapping[header] = byNormalizedHeader.get(normalizeHeader(header)) ?? null;
  }
  return mapping;
}

function applyDefaultHeaderMap(headers: string[]): HeaderFieldMapping {
  const defaultByNormalizedHeader = new Map(
    Object.entries(DEFAULT_HEADER_MAP).map(([header, field]) => [normalizeHeader(header), field])
  );
  const mapping: HeaderFieldMapping = {};
  for (const header of headers) {
    mapping[header] = defaultByNormalizedHeader.get(normalizeHeader(header)) ?? null;
  }
  return mapping;
}

export function suggestMapping(
  headers: string[],
  savedProfiles: ImportMappingProfile[]
): SuggestMappingResult {
  const matchedProfile = findMatchingProfile(headers, savedProfiles);

  if (matchedProfile) {
    return { mapping: applyProfile(headers, matchedProfile), matchedProfileName: matchedProfile.name };
  }

  return { mapping: applyDefaultHeaderMap(headers), matchedProfileName: null };
}

export function getMissingRequiredFields(mapping: HeaderFieldMapping): TargetFieldConfig[] {
  const mappedFields = new Set(Object.values(mapping).filter((field): field is keyof RawSettlementRow => field !== null));
  return TARGET_FIELDS.filter((config) => config.required && !mappedFields.has(config.field));
}

export interface DuplicateFieldAssignment {
  field: keyof RawSettlementRow;
  headers: string[];
}

export function getDuplicateFieldAssignments(mapping: HeaderFieldMapping): DuplicateFieldAssignment[] {
  const headersByField = new Map<keyof RawSettlementRow, string[]>();
  for (const [header, field] of Object.entries(mapping)) {
    if (!field) continue;
    const headers = headersByField.get(field) ?? [];
    headers.push(header);
    headersByField.set(field, headers);
  }
  return Array.from(headersByField.entries())
    .filter(([, headers]) => headers.length > 1)
    .map(([field, headers]) => ({ field, headers }));
}
