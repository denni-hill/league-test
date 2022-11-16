import { ApiProperty } from "@nestjs/swagger";

export abstract class CreateCategoryRequestDTO {
  @ApiProperty()
  slug: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  active: boolean;
}
