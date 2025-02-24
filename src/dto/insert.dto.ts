import { IsString, IsBoolean, MaxLength, IsOptional, IsDate, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTemplogDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  mcuId: string;

  @IsOptional()
  @IsBoolean()
  internet: boolean;

  @IsOptional()
  @IsBoolean()
  door: boolean;

  @IsOptional()
  @IsBoolean()
  plugin: boolean;

  @IsOptional()
  @IsNumber()
  tempValue: number;

  @IsOptional()
  @IsNumber()
  realValue: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  date: string
  
  @IsOptional()
  @IsString()
  @MaxLength(20)
  time: string

  @IsOptional()
  @IsBoolean()
  isAlert: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  probe: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
