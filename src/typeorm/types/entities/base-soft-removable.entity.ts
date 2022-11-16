import { DeleteDateColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export abstract class BaseSoftRemovableEntity extends BaseEntity {
  @DeleteDateColumn()
  deletedAt: Date;
}
