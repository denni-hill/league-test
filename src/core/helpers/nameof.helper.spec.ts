import { nameof } from "./nameof.helper";

describe("Unit test for nameof function", () => {
  class A {
    property = {
      nestedProperty: "dummy value"
    };

    static somethingStatic = "123";
  }
  const obj = new A();

  it("variable name", () => {
    expect(nameof(() => obj)).toBe("obj");
  });

  it("object property name with path", () => {
    expect(nameof(() => obj.property)).toBe("obj.property");
  });

  it("object nested property name with path", () => {
    expect(nameof(() => obj.property.nestedProperty)).toBe(
      "obj.property.nestedProperty"
    );
  });

  it("variable name with fieldNameOnly set to true", () => {
    expect(nameof(() => obj, { fieldNameOnly: true })).toBe("obj");
  });

  it("object property name with fieldNameOnly set to true", () => {
    expect(nameof(() => obj.property, { fieldNameOnly: true })).toBe(
      "property"
    );
  });

  it("object property name with fieldNameOnly set to true", () => {
    expect(
      nameof(() => obj.property.nestedProperty, { fieldNameOnly: true })
    ).toBe("nestedProperty");
  });

  it("class property with type-safe params", () => {
    expect(
      nameof((objectOfA: A) => objectOfA.property.nestedProperty, {
        fieldNameOnly: true
      })
    ).toBe("nestedProperty");
  });

  it("class name", () => {
    expect(nameof(() => A)).toBe("A");
  });

  it("class static property", () => {
    expect(nameof(() => A.somethingStatic)).toBe("A.somethingStatic");
  });

  it("class static property with fieldNameOnly set to true", () => {
    expect(nameof(() => A.somethingStatic, { fieldNameOnly: true })).toBe(
      "somethingStatic"
    );
  });
});
