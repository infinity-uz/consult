import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ChatRating, Role } from "generated/prisma";


export class CreateReviewDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    comments: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ChatRating)
    rating: ChatRating;
}
