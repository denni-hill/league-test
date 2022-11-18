import { INestApplication } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { Category, CategoryResponseDTO } from "../src/category/types";
import request from "supertest";
import { AppModule } from "../src/app.module";
import {
  createCategoriesData,
  filters,
  updateCategoriesData
} from "./test-categories";

const createdCategories: CategoryResponseDTO[] = [];

describe("App e2e", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = appModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.listen(8085);
  });

  it("create 4 categories", async () => {
    for (let i = 0; i < 4; i++) {
      const categoryData = createCategoriesData[i];

      const response = await request(app.getHttpServer())
        .post("/categories")
        .send(categoryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(categoryData);

      createdCategories.push(response.body as CategoryResponseDTO);
    }
  });

  it("fail to create categories with wrong data", async () => {
    for (let i = 4; i < createCategoriesData.length; i++) {
      const categoryData = createCategoriesData[i];

      const response = await request(app.getHttpServer())
        .post("/categories")
        .send(categoryData);

      expect(response.statusCode).toBe(422);
    }
  });

  it("fail to create category with existing slug", async () => {
    const categoryData = createCategoriesData[0];

    const response = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData);

    expect(response.statusCode).toBe(409);
  });

  it("update category", async () => {
    const newCategoryData = updateCategoriesData[0];

    const response = await request(app.getHttpServer())
      .patch(`/categories/${createdCategories[3].id}`)
      .send(newCategoryData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(newCategoryData);
    createdCategories[3] = response.body as CategoryResponseDTO;
  });

  it("fail to update category with existing slug", async () => {
    const newCategoryData = updateCategoriesData[0];
    newCategoryData.slug = createCategoriesData[0].slug;

    const response = await request(app.getHttpServer())
      .patch(`/categories/${createdCategories[3].id}`)
      .send(newCategoryData);

    expect(response.statusCode).toBe(409);
  });

  it("get category by slug", async () => {
    const response = await request(app.getHttpServer()).get(
      `/categories/${createdCategories[0].slug}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(createdCategories[0]);
  });

  it("get category by id", async () => {
    const response = await request(app.getHttpServer()).get(
      `/categories/${createdCategories[0].id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(createdCategories[0]);
  });

  it("get categories with empty filters", async () => {
    const response = await request(app.getHttpServer()).get("/categories");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[3],
      createdCategories[2]
    ]);
  });

  it("get categories, filtered by name", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[0]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([createdCategories[0]]);
  });

  it("get categories, filtered by description", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[0]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([createdCategories[0]]);
  });

  it("get categories, filtered by description", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[1]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([createdCategories[1]]);
  });

  it("get 2 categories, filtered by active = true", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[2]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[2],
      createdCategories[1]
    ]);
  });

  it("get 2 categories, filtered by active = true and createDate asc", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[3]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[0],
      createdCategories[1]
    ]);
  });

  it("get 2 categories, filtered by search and createDate asc", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[4]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[0],
      createdCategories[1]
    ]);
  });

  it("get 2 categories, filtered by search and createDate asc", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[4]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[0],
      createdCategories[1]
    ]);
  });

  it("get 2 categories, filtered by search and createDate asc", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[4]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[0],
      createdCategories[1]
    ]);
  });

  it("get 4 categories, sorted createDate asc", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[5]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[0],
      createdCategories[1],
      createdCategories[2],
      createdCategories[3]
    ]);
  });

  it("get 2 categories from page 2, sorted createDate asc", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[6]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[2],
      createdCategories[3]
    ]);
  });

  it("get categories with empty filters", async () => {
    const response = await request(app.getHttpServer())
      .get("/categories")
      .query(filters[7]);

    console.dir(response.body, { depth: null });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toMatchObject([
      createdCategories[3],
      createdCategories[2]
    ]);
  });

  it("delete created categories", async () => {
    for (let i = 0; i < createdCategories.length; i++) {
      const categoryToDelete = createdCategories[i];

      const expectedResponseBody: Partial<Category> = { ...categoryToDelete };
      delete expectedResponseBody.id;

      const response = await request(app.getHttpServer()).delete(
        `/categories/${categoryToDelete.id}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(expectedResponseBody);
    }
  });

  afterAll(async () => {
    app.close();
  });
});
