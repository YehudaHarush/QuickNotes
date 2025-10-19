import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { notesService, Note } from "../services/notesService";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import "./Dashboard.css";

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTags]);

  const loadNotes = async (tags?: string[]) => {
    try {
      setLoading(true);
      const data = await notesService.getNotes(tags);
      setNotes(data);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    if (searchTags.length === 0) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter((note) =>
        searchTags.every((tag) => note.tags.includes(tag))
      );
      setFilteredNotes(filtered);
    }
  };

  const handleCreate = () => {
    setEditingNote(null);
    setShowModal(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await notesService.deleteNote(id);
      await loadNotes(searchTags.length > 0 ? searchTags : undefined);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleSave = async () => {
    setShowModal(false);
    await loadNotes(searchTags.length > 0 ? searchTags : undefined);
  };

  const handleAddSearchTag = () => {
    const tag = tagInput.trim();
    if (tag && !searchTags.includes(tag)) {
      setSearchTags([...searchTags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveSearchTag = (tag: string) => {
    setSearchTags(searchTags.filter((t) => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSearchTag();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>QuickNotes</h1>
          <div className="user-info">
            <span>Welcome, {user?.name || user?.email}!</span>
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button onClick={handleCreate} className="btn-primary">
            + New Note
          </button>

          <div className="tag-filter">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Filter by tag..."
              className="tag-input"
            />
            <button onClick={handleAddSearchTag} className="btn-secondary">
              Add Filter
            </button>
          </div>

          {searchTags.length > 0 && (
            <div className="active-filters">
              <span>Active filters:</span>
              {searchTags.map((tag) => (
                <span key={tag} className="filter-tag">
                  {tag}
                  <button onClick={() => handleRemoveSearchTag(tag)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading your notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <h2>
              {notes.length === 0
                ? "No notes yet"
                : "No notes match your filters"}
            </h2>
            <p>
              {notes.length === 0
                ? "Create your first note to get started!"
                : "Try adjusting your tag filters"}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NoteModal
          note={editingNote}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Dashboard;
