import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../../category";

export abstract class CategoryResponseDTO implements Category {
  @ApiProperty()
  id: string;
  @ApiProperty()
  slug: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdDate: Date;
  @ApiProperty()
  active: boolean;
}
