// src/components/TaskCard.js
// Task card component with move dropdown functionality
import { useState } from 'react';
import { Calendar, AlertCircle, Trash2, Edit2, Check, MoveRight, ChevronDown } from 'lucide-react';

const TaskCard = ({ task, index, onEdit, onDelete, onToggleComplete, onMoveTask, lists, currentListId }) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleComplete = (e) => {
    e.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete(task.id, !task.completed);
    }
  };

  const handleMoveToList = (listId) => {
    if (onMoveTask && listId !== currentListId) {
      onMoveTask(task.id, listId);
    }
    setShowMoveMenu(false);
  };

  // Filter out current list from move options
  const availableLists = lists?.filter(list => list.id !== currentListId) || [];

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-complete-section">
          <button 
            onClick={handleComplete}
            className={`complete-checkbox ${task.completed ? 'checked' : ''}`}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed && <Check size={14} />}
          </button>
          <div
            className="task-priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          />
        </div>
        <div className="task-actions">
          {/* Move to list button */}
          {availableLists.length > 0 && (
            <div className="move-menu-container">
              <button 
                onClick={() => setShowMoveMenu(!showMoveMenu)}
                className="icon-button move-button"
                title="Move to another list"
              >
                <MoveRight size={14} />
              </button>
              
              {showMoveMenu && (
                <>
                  <div className="menu-backdrop" onClick={() => setShowMoveMenu(false)} />
                  <div className="move-dropdown">
                    <div className="move-dropdown-header">Move to:</div>
                    {availableLists.map(list => (
                      <button
                        key={list.id}
                        className="move-dropdown-item"
                        onClick={() => handleMoveToList(list.id)}
                      >
                        <MoveRight size={14} />
                        {list.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          <button 
            onClick={handleEdit}
            className="icon-button"
            title="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={handleDelete}
            className="icon-button"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.dueDate && (
        <div className={`task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
          {isOverdue(task.dueDate) ? (
            <AlertCircle size={14} />
          ) : (
            <Calendar size={14} />
          )}
          <span>{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
