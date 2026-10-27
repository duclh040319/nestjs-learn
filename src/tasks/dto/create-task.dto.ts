import {
    IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/\S/, {
    message: 'Title must contain at least one non-whitespace character',
  })
  title: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean
}