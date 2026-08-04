export const settlementKeys = {
  all: ["settlements"] as const,
  list: (params: { page: number; pageSize: number; groupId?: number }) =>
    [...settlementKeys.all, "list", params] as const,
  allList: () => [...settlementKeys.all, "all-list"] as const,
  detail: (id: number) => [...settlementKeys.all, "detail", id] as const,
};
