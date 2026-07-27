import type { ImportMappingProfile } from "./types";

// Shape-compatible with TargetField (src/features/target-fields/types.ts) so a
// live TargetField[] from the DB can be passed anywhere this type is expected.
export interface TargetFieldConfig {
  key: string;
  label: string;
  required: boolean;
}

/**
 * The 10 fields Settlement had before target fields became DB-configurable.
 * Kept as the source-of-truth shape for the built-in TargetField seed rows
 * (see prisma/migrations/20260727141648_add_target_fields) and as a default
 * for tests — the live target field list always comes from the TargetField table.
 */
export const BUILT_IN_TARGET_FIELDS: TargetFieldConfig[] = [
  { key: "orderNo", label: "주문번호", required: true },
  { key: "campaignName", label: "캠페인명", required: true },
  { key: "buyerName", label: "구매자명", required: true },
  { key: "buyerPhone", label: "구매자 연락처", required: false },
  { key: "purchaseAmount", label: "구매금액", required: true },
  { key: "paybackAmount", label: "페이백 금액", required: true },
  { key: "bankName", label: "은행명", required: true },
  { key: "bankAccountNumber", label: "계좌번호", required: true },
  { key: "bankAccountHolder", label: "예금주", required: true },
  { key: "memo", label: "메모", required: false },
];

export const DEFAULT_HEADER_MAP: Record<string, string> = {
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

export type HeaderFieldMapping = Record<string, string | null>;

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
    Object.entries(profile.mapping).map(([header, field]) => [normalizeHeader(header), field])
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

export function getMissingRequiredFields(
  mapping: HeaderFieldMapping,
  targetFields: TargetFieldConfig[]
): TargetFieldConfig[] {
  const mappedFields = new Set(Object.values(mapping).filter((field): field is string => field !== null));
  return targetFields.filter((config) => config.required && !mappedFields.has(config.key));
}

export interface DuplicateFieldAssignment {
  field: string;
  headers: string[];
}

export function getDuplicateFieldAssignments(mapping: HeaderFieldMapping): DuplicateFieldAssignment[] {
  const headersByField = new Map<string, string[]>();
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
