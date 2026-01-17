import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from '../auth/decorators/current-user.decorator';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { multerOptions } from './multer.config';

@Controller('albums/:albumId/photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  /**
   * Upload a photo to an album
   */
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @Param('albumId') albumId: string,
    @CurrentUser() user: JwtUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePhotoDto,
  ) {
    return this.photosService.create(user.userId, albumId, file, dto);
  }

  /**
   * List all photos from an album
   */
  @Get()
  findAll(@Param('albumId') albumId: string, @CurrentUser() user: JwtUser) {
    return this.photosService.findAllByAlbum(albumId, user.userId);
  }

  /**
   * Delete a photo (only album owner)
   */
  @Delete(':photoId')
  remove(@Param('photoId') photoId: string, @CurrentUser() user: JwtUser) {
    return this.photosService.remove(photoId, user.userId);
  }
}
