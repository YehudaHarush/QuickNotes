import { Note } from "../services/notesService";
import "./NoteCard.css";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if the note has been updated (timestamps differ)
  const isUpdated =
    new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime();

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3>{note.title}</h3>
        <div className="note-card-actions">
          <button onClick={() => onEdit(note)} className="action-btn edit">
            ✎
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="action-btn delete"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="note-card-content">{note.content}</div>

      {note.tags.length > 0 && (
        <div className="note-card-tags">
          {note.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="note-card-footer">
        <span className="note-date">Created {formatDate(note.createdAt)}</span>
        {isUpdated && (
          <span className="note-date">
            Updated {formatDate(note.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
