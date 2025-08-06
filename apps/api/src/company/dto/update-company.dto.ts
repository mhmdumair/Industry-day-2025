import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { CompanySponsership } from 'src/company/entities/company.entity';
import { CompanyStream } from '../entities/company.entity'; // or wherever your enums are
import { User } from 'src/typeorm/entities';
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
  logo?: string;

  @IsOptional()
  @IsEnum(CompanyStream)
  stream?: CompanyStream;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  companyWebsite?: string;

  @IsOptional()
  user :UpdateUserDto
}
