import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateBookDoctorTimeDto {


    @ApiProperty({
        example: '2025-10-01',
        description: "Qabul kuni (string da masalan '2025-10-01')",
    })
    @IsString()
    @IsNotEmpty()
    date: string


    @ApiProperty({
        example: '10:00',
        description: "Boshlanish vaqti (string da, masalan '10:00')",
    })
    @IsString()
    @IsNotEmpty()
    startTime: string


    @ApiProperty({
        example: '11:00',
        description: "Tugash vaqti (string da, masalan '11:00')",
    })
    @IsString()
    @IsNotEmpty()
    finishTime: string;


    @ApiProperty({
        example: [1],
        description: "Doktor ID lar royxati ",
    })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    doctorId: number[];


}
