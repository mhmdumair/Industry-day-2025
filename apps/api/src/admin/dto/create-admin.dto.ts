import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

export class AdminDto {
    @IsString()
    @IsNotEmpty()
    adminID: string;

    @IsString()
    @IsNotEmpty()
    userID: string;

    @IsString()
    @IsNotEmpty()
    designation: string;
}

export class CreateAdminDto {
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;

    @ValidateNested()
    @Type(() => AdminDto)
    admin: AdminDto;
}