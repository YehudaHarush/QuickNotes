import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query('tags') tags?: string) {
    const tagArray = tags ? tags.split(',').map(t => t.trim()) : undefined;
    return this.notesService.findAll(req.user.userId, tagArray);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    return this.notesService.update(id, updateNoteDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.notesService.remove(id, req.user.userId);
  }
}
