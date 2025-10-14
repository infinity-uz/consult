import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChatRating } from 'generated/prisma';

export class UpdateReviewDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    comments: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ChatRating)
    rating: ChatRating;
}
