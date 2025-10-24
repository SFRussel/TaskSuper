// src/components/ListModal.js
// Modal for creating or renaming lists
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ListModal = ({ isOpen, onClose, onSave, listTitle = '' }) => {
  const [title, setTitle] = useState(listTitle);
  const isEditing = listTitle !== '';

  useEffect(() => {
    setTitle(listTitle);
  }, [listTitle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      setTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Rename List' : 'Create New List'}</h2>
          <button onClick={onClose} className="icon-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="list-title">List Name</label>
            <input
              id="list-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., To Do, In Progress, Done"
              autoFocus
              maxLength={50}
            />
            <p className="input-hint">{title.length}/50 characters</p>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={!title.trim()}>
              {isEditing ? 'Save Changes' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListModal;