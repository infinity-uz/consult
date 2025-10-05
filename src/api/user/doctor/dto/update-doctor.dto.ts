import {  PartialType } from '@nestjs/swagger';
import { RegisterDoctorDto } from './register-doctor.dto';

export class UpdateDoctorDto extends PartialType(RegisterDoctorDto) {}
