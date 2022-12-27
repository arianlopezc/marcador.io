import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Operation } from './operation.enum';
import { StringContainsNoInvalidCharacters } from './string-contains-no-invalid-characters.validator';

export class ItemDto {
  @IsString()
  @MaxLength(70)
  @StringContainsNoInvalidCharacters({
    message:
      'itemId value is not allowed to have forbidden characters: [`!@$%&*()\\=\\[\\]{};"\'\\\\|,.<>/?]',
  })
  itemId: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 5 })
  @Max(999999999999)
  @Min(0)
  total: number;

  @IsEnum(Operation, {
    message: 'operation must be a valid value: add, subtract, and set',
  })
  operation: Operation;
}
