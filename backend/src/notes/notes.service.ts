import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private redisService: RedisService,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      userId,
      tags: createNoteDto.tags || [],
    });

    const savedNote = await this.notesRepository.save(note);
    
    // Invalidate cache for this user
    await this.redisService.invalidateUserCache(userId);
    
    return savedNote;
  }

  async findAll(userId: string, tags?: string[]): Promise<Note[]> {
    // Try to get from cache first
    const cacheKey = this.redisService.generateCacheKey(userId, tags);
    const cachedNotes = await this.redisService.get(cacheKey);
    
    if (cachedNotes) {
      return JSON.parse(cachedNotes);
    }

    // Build query
    const queryBuilder = this.notesRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId })
      .orderBy('note.updatedAt', 'DESC');

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      tags.forEach((tag, index) => {
        queryBuilder.andWhere(
          `note.tags LIKE :tag${index}`,
          { [`tag${index}`]: `%${tag}%` },
        );
      });
    }

    const notes = await queryBuilder.getMany();
    
    // Cache the results
    await this.redisService.set(cacheKey, JSON.stringify(notes), 300); // 5 minutes
    
    return notes;
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.findOne(id, userId);

    if (note.userId !== userId) {
      throw new ForbiddenException('You can only update your own notes');
    }

    Object.assign(note, updateNoteDto);
    const updatedNote = await this.notesRepository.save(note);
    
    // Invalidate cache for this user
    await this.redisService.invalidateUserCache(userId);
    
    return updatedNote;
  }

  async remove(id: string, userId: string): Promise<void> {
    const note = await this.findOne(id, userId);

    if (note.userId !== userId) {
      throw new ForbiddenException('You can only delete your own notes');
    }

    await this.notesRepository.delete(id);
    
    // Invalidate cache for this user
    await this.redisService.invalidateUserCache(userId);
  }
}
