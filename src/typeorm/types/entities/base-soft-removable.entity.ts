import { DeleteDateColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export abstract class BaseSoftRemovableEntity<
  TId = number
> extends BaseEntity<TId> {
  @DeleteDateColumn()
  deletedAt: Date;
}
