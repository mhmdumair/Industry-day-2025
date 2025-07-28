import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { CompanySponsership } from 'src/company/entities/company.entity';

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
  companyName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(CompanySponsership)
  @IsNotEmpty()
  sponsership: CompanySponsership;

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

