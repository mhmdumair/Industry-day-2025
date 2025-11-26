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

  @IsString()
  @IsOptional()
  logoPublicId?: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsUrl()
  @IsOptional()
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