import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateBookDoctorDto {
  @ApiProperty({
    example: '2025-10-05T10:00:00Z',
    description: 'Qachon uchrashuv bo‘lishi',
  })
  @IsDateString()
  bookDate: string;

  @ApiProperty({
    example: 'Toshkent shahar, Chilonzor 5',
    description: 'Manzil',
  })
  @IsString()
  location: string;

  @ApiProperty({ example: 1, description: 'Xizmat ID' })
  @IsNumber()
  serviceID: number;

  @ApiProperty({ example: 3, description: 'Doktor ID' })
  @IsNumber()
  doctorId: number;

  @ApiProperty({ example: 2, description: 'Mutaxassislik ID' })
  @IsNumber()
  specialityId: number;

  @ApiProperty({
    example: "Bosh og'rig'i",
    description: 'Nima uchun murojat qilyatgani',
  })
  notes?: string | null;
}
