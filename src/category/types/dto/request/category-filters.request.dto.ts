import { ApiProperty } from "@nestjs/swagger";

export abstract class CategoryFiltersRequestDTO {
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  active?: string;
  @ApiProperty({ required: false })
  search?: string;
  @ApiProperty({ required: false })
  pageSize?: number;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  sort?: string;
}
