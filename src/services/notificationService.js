// src/services/notificationService.js
// Service for handling email and deadline notifications
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Schedule a notification for a task deadline
export const scheduleDeadlineNotification = async (userId, taskId, taskTitle, dueDate) => {
  try {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId,
      taskId,
      type: 'deadline',
      title: 'Task Deadline Approaching',
      message: `Task "${taskTitle}" is due soon!`,
      dueDate,
      read: false,
      createdAt: serverTimestamp()
    });
    return { success: true, id: notificationRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send email notification (this would typically be handled by Cloud Functions)
export const sendEmailNotification = async (userId, subject, message) => {
  try {
    // In a real app, this would trigger a Cloud Function
    const emailRef = await addDoc(collection(db, 'emailQueue'), {
      userId,
      subject,
      message,
      sent: false,
      createdAt: serverTimestamp()
    });
    return { success: true, id: emailRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user notifications
export const getUserNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check for upcoming deadlines and create notifications
export const checkUpcomingDeadlines = async (userId, tasks) => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  for (const task of tasks) {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (dueDate <= tomorrow && dueDate > now) {
        await scheduleDeadlineNotification(userId, task.id, task.title, task.dueDate);
      }
    }
  }
};
