import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageService } from './image.service';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post()
  @ApiOperation({ summary: 'Yangi rasm qo\'shish' })
  @ApiResponse({ status: 201, description: 'Rasm muvaffaqiyatli qo\'shildi' })
  create(@Body() dto: CreateImageDto) {
    return this.imageService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha rasmlarni olish' })
  @ApiResponse({ status: 200, description: 'Barcha rasm ro\'yxati' })
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta rasmni olish' })
  @ApiResponse({ status: 200, description: 'Rasm topildi' })
  @ApiResponse({ status: 404, description: 'Rasm topilmadi' })
  findOne(@Param('id') id: number) {
    return this.imageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rasmni yangilash' })
  @ApiResponse({ status: 200, description: 'Rasm muvaffaqiyatli yangilandi' })
  update(@Param('id') id: number, @Body() dto: UpdateImageDto) {
    return this.imageService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rasmni o\'chirish' })
  @ApiResponse({ status: 200, description: 'Rasm muvaffaqiyatli o\'chirildi' })
  remove(@Param('id') id: number) {
    return this.imageService.remove(id);
  }
}
