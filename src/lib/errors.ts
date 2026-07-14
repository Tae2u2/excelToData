export interface BulkRowFailure {
  rowNumber: number;
  reason: string;
}

export class BulkValidationError extends Error {
  failures: BulkRowFailure[];

  constructor(failures: BulkRowFailure[]) {
    super("Bulk validation failed");
    this.failures = failures;
  }
}
