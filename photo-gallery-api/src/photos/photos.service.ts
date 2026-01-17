import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Upload and create a photo linked to an album
   */
  async create(
    userId: string,
    albumId: string,
    file: Express.Multer.File,
    dto: CreatePhotoDto,
  ): Promise<Photo> {
    if (!file) {
      throw new BadRequestException('File not provided');
    }

    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('You cannot add photos to this album');
    }

    return this.prisma.photo.create({
      data: {
        title: dto.title?.trim() || file.originalname,
        description: dto.description?.trim() || null,
        dominantColor: dto.dominantColor || null,
        acquiredAt: dto.acquiredAt ? new Date(dto.acquiredAt) : null,
        size: file.size,
        fileUrl: `/uploads/photos/${file.filename}`,
        albumId,
      },
    });
  }

  /**
   * List all photos from an album
   * Public albums can be accessed by anyone authenticated
   * Private albums only by the owner
   */
  async findAllByAlbum(albumId: string, userId: string): Promise<Photo[]> {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (!album.isPublic && album.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.photo.findMany({
      where: { albumId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete a photo (only album owner)
   */
  async remove(photoId: string, userId: string): Promise<{ message: string }> {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
      include: { album: true },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.album.userId !== userId) {
      throw new ForbiddenException('You cannot delete this photo');
    }

    // Remove file from disk
    const filePath = join(process.cwd(), photo.fileUrl);
    await unlink(filePath).catch(() => null);

    await this.prisma.photo.delete({
      where: { id: photoId },
    });

    return { message: 'Photo deleted successfully' };
  }
}
