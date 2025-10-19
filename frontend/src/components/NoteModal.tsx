import { useState, useEffect } from "react";
import { notesService, Note, CreateNoteDto } from "../services/notesService";
import "./NoteModal.css";

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
  onSave: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    }
  }, [note]);

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const noteData: CreateNoteDto = {
        title: title.trim(),
        content: content.trim(),
        tags,
      };

      if (note) {
        await notesService.updateNote(note.id, noteData);
      } else {
        await notesService.createNote(noteData);
      }

      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{note ? "Edit Note" : "Create New Note"}</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tag-input-wrapper">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-add-tag"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="tags-list">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
