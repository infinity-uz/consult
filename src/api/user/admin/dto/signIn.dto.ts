import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class SignInDto extends PickType(CreateAdminDto, [
  'username',
  'password',
]) {
    @ApiProperty({
        type: 'string',
        description: 'Username for admin',
        example: 'Admin1',
      })
      @MinLength(5)
      @IsString()
      @IsNotEmpty()
      username: string;
    
      @ApiProperty({
        type: 'string',
        description: 'Password for admin',
        example: 'Admin123!',
      })
      @IsStrongPassword()
      @IsNotEmpty()
      password: string;
}
