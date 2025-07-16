import { IsEnum, IsNumber, IsOptional, IsString, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "../types";
import { Currency } from "../../account";

export class CreateTransactionRequest {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ minimum: 0.01, maximum: 10000.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(10000.0)
  amount: number;

  @ApiProperty({ enum: Currency })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string;
}
