import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from '../auth/decorators/current-user.decorator';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('albums')
@UseGuards(JwtAuthGuard)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  /**
   * Create a new album
   */
  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateAlbumDto) {
    return this.albumsService.create(user.userId, dto);
  }

  /**
   * List albums from logged user
   */
  @Get()
  findMyAlbums(@CurrentUser() user: JwtUser) {
    return this.albumsService.findAllByUser(user.userId);
  }

  /**
   * Get one album by id
   * - Public albums: accessible
   * - Private albums: only owner
   */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.albumsService.findOneById(id, user.userId);
  }

  /**
   * Update an album (only owner)
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateAlbumDto,
  ) {
    return this.albumsService.update(id, user.userId, dto);
  }

  /**
   * Delete an album (only owner)
   */

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.albumsService.remove(id, user.userId);
  }
}
