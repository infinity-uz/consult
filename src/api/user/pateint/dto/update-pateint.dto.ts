import {  PartialType } from '@nestjs/swagger';
import { RegisterPateintDto } from './register-pateint.dto';

export class UpdatePateintDto extends PartialType(RegisterPateintDto) {}
