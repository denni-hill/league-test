import { ValidationResult } from "./validation-result";

export interface Validation<TValue> {
  validate(
    input: any
  ): ValidationResult<TValue> | Promise<ValidationResult<TValue>>;
}
