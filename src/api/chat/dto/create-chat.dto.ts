import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ChatRating, Role } from "generated/prisma";


export class CreateChatDto {
    @ApiProperty()
    @IsOptional()
    @IsEnum(ChatRating)
    rating?: ChatRating;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    comments: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Role)
    fromUserRole: Role;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Role)
    toUserRole: Role;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    doctorId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    pateintsId: number;
}
