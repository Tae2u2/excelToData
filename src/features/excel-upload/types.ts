export interface ImportMappingProfile {
  id: number;
  name: string;
  mapping: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImportMappingInput {
  name: string;
  mapping: Record<string, string>;
}
