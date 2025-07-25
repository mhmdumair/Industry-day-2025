import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/typeorm/entities/user/user.entity';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

export enum CompanyStream {
  ZL = 'ZL',
  BT = 'BT',
  CH = 'CH',
  MT = 'MT',
  BMS = 'BMS',
  ST = 'ST',
  GL = 'GL',
  CS = 'CS',
  DS = 'DS',
  ML = 'ML',
  BL = 'BL',
  MB = 'MB',
  CM = 'CM',
  AS = 'AS',
  ES = 'ES',
  SOR = 'SOR',
}

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  companyID: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  contactPersonName: string;

  @IsString()
  @IsNotEmpty()
  contactPersonDesignation: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsEnum(CompanyStream)
  @IsNotEmpty()
  stream: CompanyStream;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsUrl()
  @IsNotEmpty()
  companyWebsite: string;
}

export class CreateCompanyDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}
