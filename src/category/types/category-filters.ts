export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export interface Sort {
  fieldName: string;
  direction: SortDirection;
}

export interface CategoryFilters {
  name?: string;
  description?: string;
  active?: boolean;
  search?: string;
  pageSize?: number;
  page?: number;
  sort?: Sort;
}
