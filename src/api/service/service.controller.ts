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
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import { paginationData } from 'src/common/document/paginationData';
import { PaginationQueryDto } from 'src/common/dto/query-pagination.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  //-------------------- create --------------------
  @ApiOperation({ summary: 'Create service' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Service created successfully',
  })
  @ApiBearerAuth()
  @AccessRoles(Roles.SUPERADMIN)
  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  //-------------------- update --------------------
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service updated successfully',
  })
  @ApiBearerAuth()
  @AccessRoles(Roles.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.serviceService.update(+id, dto);
  }

  // ----------- FIND ALL WITH PAGINATIO -----------
  @ApiOperation({ summary: 'Find all services with pagination' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'All services get successfully with pagination',
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
    description: 'Error on get services',
    schema: {
      example: {
        statusCode: 500,
        error: {
          message: 'Internal server error',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN)
  @Get()
  @ApiBearerAuth()
  async findAll(@Query() query: PaginationQueryDto) {
    return this.serviceService.findAllWithPagination({
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
  @ApiOperation({ summary: 'FindById service' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Service Find successfully',
  })
  @ApiBearerAuth()
  @AccessRoles(Roles.SUPERADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOneById(+id);
  }
}
