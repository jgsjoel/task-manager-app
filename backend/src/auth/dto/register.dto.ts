import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions: sanitizeHtml.IOptions = { allowedTags: [], allowedAttributes: {} };

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Transform(({ value }) => typeof value === 'string' ? sanitizeHtml(value, sanitizeOptions).trim() : value)
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
