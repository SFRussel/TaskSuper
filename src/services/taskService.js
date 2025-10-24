// src/services/taskService.js
// Service for managing tasks and boards
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Create a new board
export const createBoard = async (userId, boardData) => {
  try {
    const boardRef = await addDoc(collection(db, 'boards'), {
      userId,
      title: boardData.title,
      lists: boardData.lists || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: boardRef.id };
  } catch (error) {
    console.error('Error creating board:', error);
    return { success: false, error: error.message };
  }
};

// Create a new task
export const createTask = async (boardId, listId, taskData) => {
  try {
    const taskRef = await addDoc(collection(db, 'tasks'), {
      boardId,
      listId,
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      order: taskData.order || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: taskRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update task
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Subscribe to tasks for a board
export const subscribeToTasks = (boardId, callback) => {
  const q = query(
    collection(db, 'tasks'),
    where('boardId', '==', boardId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side to avoid index requirement
    tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
    callback(tasks);
  }, (error) => {
    console.error('Error in subscribeToTasks:', error);
    callback([]);
  });
};

// Subscribe to boards for a user
export const subscribeToBoards = (userId, callback) => {
  const q = query(
    collection(db, 'boards'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const boards = [];
    snapshot.forEach((doc) => {
      boards.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side to avoid index requirement
    boards.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
    callback(boards);
  }, (error) => {
    console.error('Error in subscribeToBoards:', error);
    callback([]);
  });
};

// Update board
export const updateBoard = async (boardId, updates) => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    await updateDoc(boardRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
