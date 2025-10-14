import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChatRating } from 'generated/prisma';

export class UpdateChatDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    comments: string;
}
