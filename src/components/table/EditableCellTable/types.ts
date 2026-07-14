export interface CellValidationResult {
  ok: boolean;
  message?: string;
}

export interface ColumnDef<TRow> {
  field: keyof TRow;
  header: string;
}

export interface EditableRow<TRow> {
  id: string | number;
  data: TRow;
  cellResults?: Partial<Record<keyof TRow, CellValidationResult>>;
}

export interface EditableCellTableProps<TRow> {
  columns: ColumnDef<TRow>[];
  rows: EditableRow<TRow>[];
  onCellChange: (rowId: string | number, field: keyof TRow, value: string) => void;
}
