import { IsString, MinLength, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions: sanitizeHtml.IOptions = { allowedTags: [], allowedAttributes: {} };

export class CreateTaskDto {
  @Transform(({ value }) => typeof value === 'string' ? sanitizeHtml(value, sanitizeOptions).trim() : value)
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? sanitizeHtml(value, sanitizeOptions).trim() : value)
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed?: boolean;
}
