export const settlementGroupKeys = {
  all: ["settlement-groups"] as const,
  list: () => [...settlementGroupKeys.all, "list"] as const,
  detail: (id: number) => [...settlementGroupKeys.all, "detail", id] as const,
};
