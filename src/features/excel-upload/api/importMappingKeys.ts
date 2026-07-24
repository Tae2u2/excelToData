export const importMappingKeys = {
  all: ["import-mappings"] as const,
  list: () => [...importMappingKeys.all, "list"] as const,
};
