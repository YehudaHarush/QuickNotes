import api from "./api";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string[];
}

export const notesService = {
  async getNotes(tags?: string[]): Promise<Note[]> {
    const params = tags && tags.length > 0 ? { tags: tags.join(",") } : {};
    const response = await api.get("/notes", { params });
    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  async createNote(data: CreateNoteDto): Promise<Note> {
    const response = await api.post("/notes", data);
    return response.data;
  },

  async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
    const response = await api.patch(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};
