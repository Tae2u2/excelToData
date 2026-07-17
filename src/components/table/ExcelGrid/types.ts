export interface ExcelGridColumn {
  title: string;
  dataIndex: string;
  key: string;
}

export interface ExcelCell {
  value: string;
  merge?: { colspan: number; rowspan: number };
  merged?: boolean;
}

export type ExcelSheet = Record<string, ExcelCell>;
