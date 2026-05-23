import "@tanstack/vue-table"

declare module "@tanstack/vue-table" {
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right"
  }
}

interface PaginationTable {
  page: number
  per_page: number
  total: number
  last_page: number
}

interface OnChangeTable {
  page: number,
  per_page: number,
  sort_by?: string,
  sort_desc?: boolean,
}