// src/pages/Board.js
// Main board page with task management
import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  createTask, 
  updateTask, 
  deleteTask, 
  subscribeToTasks, 
  createBoard, 
  subscribeToBoards,
  updateBoard 
} from '../services/taskService';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import Settings from '../components/Settings';
import ListModal from '../components/ListModal';
import ConfirmDialog from '../components/ConfirmDialog';

const Board = () => {
  const { currentUser, userData } = useAuth();
  const boardContentRef = useRef(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentListId, setCurrentListId] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    listId: null,
    taskCount: 0
  });
  const [taskDeleteDialog, setTaskDeleteDialog] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: ''
  });
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  
  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Force stop loading after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Loading timeout - stopping loader');
        setLoading(false);
        if (!currentBoard) {
          setError('Could not connect to Firebase. Please check your configuration.');
        }
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [loading, currentBoard]);

  // Initialize board
  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe;
    let mounted = true;

    const initBoard = async () => {
      try {
        console.log('Initializing board for user:', currentUser.uid);
        
        unsubscribe = subscribeToBoards(currentUser.uid, async (boards) => {
          if (!mounted) return;
          
          console.log('Boards received:', boards.length);
          
          if (boards.length === 0) {
            console.log('No boards found, creating one...');
            try {
              const result = await createBoard(currentUser.uid, { 
                title: 'My Board',
                lists: []
              });
              
              if (result.success) {
                console.log('Board created successfully');
              } else {
                console.error('Failed to create board:', result.error);
                setError('Failed to create board: ' + result.error);
                setLoading(false);
              }
            } catch (err) {
              console.error('Error creating board:', err);
              setError('Error creating board. Check Firebase configuration.');
              setLoading(false);
            }
          } else {
            console.log('Using existing board:', boards[0].id);
            setCurrentBoard(boards[0]);
            setLists(boards[0].lists || []);
            setLoading(false);
            setError(null);
          }
        });
      } catch (err) {
        console.error('Error in initBoard:', err);
        setError('Firebase connection error. Please check your configuration.');
        setLoading(false);
      }
    };

    initBoard();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Subscribe to tasks
  useEffect(() => {
    if (!currentBoard?.id) return;

    console.log('Subscribing to tasks for board:', currentBoard.id);
    const unsubscribe = subscribeToTasks(currentBoard.id, (tasksData) => {
      console.log('Tasks received:', tasksData.length);
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [currentBoard?.id]);

  const handleMoveTask = async (taskId, newListId) => {
    try {
      console.log('Moving task:', taskId, 'to list:', newListId);
      
      // Update task in Firebase
      await updateTask(taskId, {
        listId: newListId
      });
      
      console.log('Task moved successfully');
    } catch (error) {
      console.error('Error moving task:', error);
      alert('Error moving task: ' + error.message);
    }
  };

  const handleAddTask = (listId) => {
    setCurrentTask(null);
    setCurrentListId(listId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setCurrentListId(task.listId);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskId, taskData) => {
    if (!currentBoard?.id) {
      alert('Board not ready. Please try again.');
      return;
    }

    try {
      if (taskId) {
        await updateTask(taskId, taskData);
      } else {
        const tasksInList = tasks.filter(t => t.listId === taskData.listId);
        const newOrder = tasksInList.length;
        
        await createTask(currentBoard.id, taskData.listId, {
          ...taskData,
          order: newOrder,
          completed: false
        });
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task: ' + error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setTaskDeleteDialog({
      isOpen: true,
      taskId: taskId,
      taskTitle: task?.title || 'this task'
    });
  };

  const confirmDeleteTask = async () => {
    const { taskId } = taskDeleteDialog;
    await deleteTask(taskId);
    setTaskDeleteDialog({ isOpen: false, taskId: null, taskTitle: '' });
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await updateTask(taskId, { completed });
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleAddList = () => {
    setEditingList(null);
    setIsListModalOpen(true);
  };

  const handleSaveList = async (listTitle) => {
    if (editingList) {
      const updatedLists = lists.map(l => 
        l.id === editingList.id ? { ...l, title: listTitle } : l
      );
      setLists(updatedLists);

      if (currentBoard) {
        await updateBoard(currentBoard.id, { lists: updatedLists });
      }
    } else {
      const newList = {
        id: `list-${Date.now()}`,
        title: listTitle
      };

      const updatedLists = [...lists, newList];
      setLists(updatedLists);

      if (currentBoard) {
        await updateBoard(currentBoard.id, { lists: updatedLists });
      }
    }
  };

  const handleDeleteList = async (listId) => {
    const tasksInList = tasks.filter(t => t.listId === listId);
    
    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      listId: listId,
      taskCount: tasksInList.length
    });
  };

  const confirmDeleteList = async () => {
    const { listId, taskCount } = confirmDialog;
    
    // Delete all tasks in the list
    if (taskCount > 0) {
      const tasksInList = tasks.filter(t => t.listId === listId);
      for (const task of tasksInList) {
        await deleteTask(task.id);
      }
    }

    // Delete the list
    const updatedLists = lists.filter(l => l.id !== listId);
    setLists(updatedLists);

    if (currentBoard) {
      await updateBoard(currentBoard.id, { lists: updatedLists });
    }

    // Close the dialog
    setConfirmDialog({ isOpen: false, listId: null, taskCount: 0 });
  };

  const handleRenameList = (listId) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    setEditingList(list);
    setIsListModalOpen(true);
  };

  const getTasksForList = (listId) => {
    let filteredTasks = tasks.filter(task => task.listId === listId);
    
    // Apply status filter
    if (filterStatus === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (filterStatus === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    return filteredTasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    // Don't start drag if clicking on interactive elements
    if (
      e.target.closest('button') || 
      e.target.closest('input') || 
      e.target.closest('textarea') ||
      e.target.closest('.task-card') ||
      e.target.closest('.task-list-header')
    ) {
      return;
    }

    setIsDragging(true);
    setStartX(e.pageX - boardContentRef.current.offsetLeft);
    setScrollLeft(boardContentRef.current.scrollLeft);
    boardContentRef.current.style.cursor = 'grabbing';
    boardContentRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      boardContentRef.current.style.cursor = 'grab';
      boardContentRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (boardContentRef.current) {
      boardContentRef.current.style.cursor = 'grab';
      boardContentRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - boardContentRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    boardContentRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>⚠️ Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="auth-button">
          Retry
        </button>
      </div>
    );
  }

  const boardStyle = userData?.backgroundImage
    ? {
        backgroundImage: `url(${userData.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }
    : {};

  return (
    <div className="board-wrapper" style={boardStyle}>
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {lists.length > 0 && (
        <div className="filter-container">
          <div className="filter-buttons">
            <button 
              className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-button ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button 
              className={`filter-button ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      )}

      <div 
        className="board-content" 
        ref={boardContentRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="lists-container">
          {lists.length === 0 ? (
            <div className="empty-board">
              <div className="empty-board-content">
                <Plus size={48} />
                <h2>Welcome to TaskSuper!</h2>
                <p>The best simple task manager - Create your first list to get started</p>
                <button className="create-first-list-button" onClick={handleAddList}>
                  <Plus size={20} />
                  Create Your First List
                </button>
              </div>
            </div>
          ) : (
            <>
              {lists.map(list => (
                <TaskList
                  key={list.id}
                  list={list}
                  tasks={getTasksForList(list.id)}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onDeleteList={handleDeleteList}
                  onRenameList={handleRenameList}
                  onMoveTask={handleMoveTask}
                  lists={lists}
                />
              ))}

              <button className="add-list-button" onClick={handleAddList}>
                <Plus size={24} />
                <span>Add List</span>
              </button>
            </>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
        listId={currentListId}
      />

      <ListModal
        isOpen={isListModalOpen}
        onClose={() => {
          setIsListModalOpen(false);
          setEditingList(null);
        }}
        onSave={handleSaveList}
        listTitle={editingList?.title || ''}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, listId: null, taskCount: 0 })}
        onConfirm={confirmDeleteList}
        title="Delete List?"
        message={
          confirmDialog.taskCount > 0
            ? `This list contains ${confirmDialog.taskCount} task${confirmDialog.taskCount > 1 ? 's' : ''}. All tasks will be permanently deleted. This action cannot be undone.`
            : 'Are you sure you want to delete this empty list? This action cannot be undone.'
        }
        confirmText="Delete List"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmDialog
        isOpen={taskDeleteDialog.isOpen}
        onClose={() => setTaskDeleteDialog({ isOpen: false, taskId: null, taskTitle: '' })}
        onConfirm={confirmDeleteTask}
        title="Delete Task?"
        message={`Are you sure you want to delete "${taskDeleteDialog.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete Task"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Board;
