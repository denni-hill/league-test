import { Category } from "./category";

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export interface Sort {
  fieldName: keyof Category;
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
