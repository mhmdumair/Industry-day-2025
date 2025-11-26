import { IsString, IsOptional, IsEnum, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanySponsership } from 'src/company/entities/company.entity';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CompanySponsership)
  sponsership?: CompanySponsership;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  contactPersonDesignation?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  logo?: string | null;

  @IsOptional()
  @IsString()
  logoPublicId?: string | null;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  companyWebsite?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto
}