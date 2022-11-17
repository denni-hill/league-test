import {
  CategoryFiltersRequestDTO,
  CreateCategoryRequestDTO,
  UpdateCategoryRequestDTO
} from "../src/category/types";

export const createCategoriesData: CreateCategoryRequestDTO[] = [
  {
    name: "Мёд",
    description: "Хорошее описание",
    slug: "honey",
    active: true
  },
  {
    name: "Пчела",
    description: "Медовое создание",
    slug: "bee",
    active: true
  },
  {
    name: "Пчеловод",
    description: "Расстрельная должность",
    slug: "beekeeper",
    active: true
  },
  {
    name: "Отвлечённая категория",
    description: "Чтобы отвлекаться",
    slug: "add",
    active: false
  }
];

export const updateCategoriesData: UpdateCategoryRequestDTO[] = [
  {
    name: "Обновлённая категория",
    description: "Чтобы обновить",
    slug: "update"
  }
];

export const filters: CategoryFiltersRequestDTO[] = [
  {
    name: "Мед"
  },
  {
    description: "Мед"
  },
  {
    active: "true"
  },
  {
    active: "1",
    sort: "createdDate"
  },
  {
    search: "Мед",
    sort: "createdDate"
  },
  {
    pageSize: 4,
    sort: "createdDate"
  },
  {
    pageSize: 2,
    page: 2,
    sort: "createdDate"
  }
];
