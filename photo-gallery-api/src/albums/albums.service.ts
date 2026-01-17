import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Album } from '@prisma/client';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        title: dto.title,
        description: dto.description,
        isPublic: dto.isPublic ?? false,
        userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<Album[]> {
    return this.prisma.album.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById(albumId: string, userId: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (!album.isPublic && album.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return album;
  }

  async update(
    albumId: string,
    userId: string,
    dto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.album.update({
      where: { id: albumId },
      data: {
        title: dto.title,
        description: dto.description,
        isPublic: dto.isPublic,
      },
    });
  }

  async remove(albumId: string, userId: string): Promise<{ message: string }> {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('You cannot delete this album');
    }

    const photosCount = await this.prisma.photo.count({
      where: { albumId },
    });

    if (photosCount > 0) {
      throw new ForbiddenException(
        'You cannot delete an album that contains photos',
      );
    }

    await this.prisma.album.delete({
      where: { id: albumId },
    });

    return { message: 'Album deleted successfully' };
  }
}
