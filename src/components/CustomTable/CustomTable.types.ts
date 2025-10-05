export interface CustomTableColumn<T = any> {
  header: string;
  accessor: keyof T | string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  fixed?: "left" | "right";
}

export interface CustomTableProps<T = any> {
  data: T[];
  columns: CustomTableColumn<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  pagination?: boolean;
  pageSize?: number;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startItem: number;
  endItem: number;
}
