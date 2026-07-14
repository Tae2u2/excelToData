export const settlementKeys = {
  all: ["settlements"] as const,
  list: () => [...settlementKeys.all, "list"] as const,
  detail: (id: number) => [...settlementKeys.all, "detail", id] as const,
};
