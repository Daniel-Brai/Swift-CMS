import { IsInt, IsOptional, IsPositive, Min, Max } from 'class-validator';

export type Order = 'ASC' | 'DESC';

export class PageOptionsDto {
  @IsOptional()
  readonly order?: Order = 'ASC';

  @Min(1)
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly page?: number = 1;

  @Max(50)
  @Min(1)
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
