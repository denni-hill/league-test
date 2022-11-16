import { ApiProperty } from "@nestjs/swagger";

export abstract class UpdateCategoryRequestDTO {
  @ApiProperty({ required: false })
  slug?: string;
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  active?: boolean;
}
