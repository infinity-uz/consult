import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import { PaginationQueryDto } from 'src/common/dto/query-pagination.dto';
import { paginationData } from 'src/common/document/paginationData';

@UseGuards(AuthGuard, RolesGuard)
@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  //---------------------- create ----------------------
  @ApiOperation({ summary: 'Create speciality' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Speciality created successfully',
  })
  @ApiBearerAuth()
  @AccessRoles(Roles.SUPERADMIN, Roles.DOCTOR)
  @Post()
  create(@Body() dto: CreateSpecialityDto) {
    return this.specialityService.create(dto);
  }

  //---------------------- update ----------------------
  @ApiOperation({ summary: 'Update speciality' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Speciality updated successfully',
  })
  @ApiBearerAuth()
  @AccessRoles(Roles.SUPERADMIN, Roles.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSpecialityDto) {
    return this.specialityService.update(+id, dto);
  }

  // ----------- FIND ALL WITH PAGINATIO -----------
  @ApiOperation({ summary: 'Find all specialities with pagination' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'All specialities get successfully with pagination',
    schema: {
      example: {
        statusCode: 201,
        message: 'success',
        data: paginationData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error on get specialities',
    schema: {
      example: {
        statusCode: 500,
        error: {
          message: 'Internal server error',
        },
      },
    },
  })

  @Get()
  @ApiBearerAuth()
  @AccessRoles(Roles.SUPERADMIN, Roles.DOCTOR,
    Roles.PATEINTS, Roles.ADMIN
  )
  async findAll(@Query() query: PaginationQueryDto) {
    return this.specialityService.findAllWithPagination({
      where: query.query
        ? {
            name: {
              contains: query.query,
              mode: 'insensitive',
            },
          }
        : {},
      page: query.page,
      pageSize: query.pageSize,
      orderBy: { createdAt: 'desc' },
    });
  }

  //-------------------- FindById -------------------
  @ApiOperation({ summary: 'FindById speciality' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Speciality Find successfully',
  })
  @ApiBearerAuth()
  @AccessRoles(Roles.SUPERADMIN, Roles.DOCTOR,
    Roles.PATEINTS, Roles.ADMIN
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialityService.findOneById(+id);
  }

  // ----------- DELETE -----------
@ApiOperation({ summary: 'Soft delete speciality' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Speciality deleted successfully',
  schema: {
    example: {
      statusCode: 200,
      message: 'success',
      data: {
        id: 1,
        name: 'Pediatrics',
        timeDeleted: '2025-10-01T12:00:00.000Z',
      },
    },
  },
})
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Speciality not found',
  schema: {
    example: {
      statusCode: 404,
      error: {
        message: 'Speciality with id 1 not found',
      },
    },
  },
})
@AccessRoles(Roles.SUPERADMIN)
@Delete(':id')
@ApiBearerAuth()
delete(@Param('id') id: string) {
  return this.specialityService.delete(+id);
}

}
