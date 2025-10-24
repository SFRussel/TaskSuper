// src/components/TaskList.js
// List container for tasks with priority sorting
import { Plus, MoreVertical, Trash2, Edit2, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ 
  list, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onToggleComplete, 
  onDeleteList, 
  onRenameList,
  onMoveTask,
  lists
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);

  const priorityOrder = {
    'high': 1,
    'medium': 2,
    'low': 3,
    '': 4
  };

  const getSortedTasks = () => {
    if (!sortByPriority) {
      return tasks;
    }
    
    return [...tasks].sort((a, b) => {
      const priorityA = priorityOrder[a.priority || ''] || 4;
      const priorityB = priorityOrder[b.priority || ''] || 4;
      return priorityA - priorityB;
    });
  };

  const sortedTasks = getSortedTasks();

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div className="task-list-title-section">
          <h2 className="task-list-title">{list.title}</h2>
          <span className="task-count">{tasks.length}</span>
        </div>
        
        <div className="task-list-actions">
          {/* Priority sort toggle */}
          <button 
            className={`icon-button sort-button ${sortByPriority ? 'active' : ''}`}
            onClick={() => setSortByPriority(!sortByPriority)}
            title={sortByPriority ? 'Sorted by priority' : 'Sort by priority'}
          >
            <ArrowUpDown size={18} />
          </button>

          <div className="list-menu">
            <button 
              className="icon-button" 
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <>
                <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
                <div className="list-dropdown">
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onRenameList?.(list.id);
                      setShowMenu(false);
                    }}
                  >
                    <Edit2 size={16} />
                    Rename List
                  </button>
                  <button 
                    className="dropdown-item delete"
                    onClick={() => {
                      onDeleteList(list.id);
                      setShowMenu(false);
                    }}
                  >
                    <Trash2 size={16} />
                    Delete List
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="task-list-content">
        {sortedTasks.length === 0 ? (
          <div className="empty-list-hint">
            <span>No tasks yet</span>
          </div>
        ) : (
          sortedTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
              onMoveTask={onMoveTask}
              lists={lists}
              currentListId={list.id}
            />
          ))
        )}
      </div>

      <button className="add-task-button" onClick={() => onAddTask(list.id)}>
        <Plus size={18} />
        <span>Add Task</span>
      </button>
    </div>
  );
};

export default TaskList;
