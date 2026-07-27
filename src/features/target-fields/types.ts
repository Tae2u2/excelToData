export interface TargetField {
  id: number;
  key: string;
  label: string;
  required: boolean;
  isBuiltIn: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTargetFieldInput {
  label: string;
  required: boolean;
}

export interface UpdateTargetFieldInput {
  label?: string;
  required?: boolean;
  sortOrder?: number;
}
