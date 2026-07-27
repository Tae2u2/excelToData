export const targetFieldKeys = {
  all: ["target-fields"] as const,
  list: () => [...targetFieldKeys.all, "list"] as const,
};
