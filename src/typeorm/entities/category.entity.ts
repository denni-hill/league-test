import { Category } from "src/category/types";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../types";

@Entity({ name: "categories" })
export class CategoryEntity extends BaseEntity<string> implements Category {
  @PrimaryColumn({ type: "uuid", generated: "uuid" })
  id: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createdDate: Date;
  @Column()
  active: boolean;
}
