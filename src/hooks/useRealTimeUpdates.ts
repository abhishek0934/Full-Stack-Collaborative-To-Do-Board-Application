import { useEffect, useRef } from 'react';
import { Task, Action, User } from '../types';

// Mock real-time updates simulation
export const useRealTimeUpdates = (
  tasks: Task[],
  onTaskUpdate: (task: Task) => void,
  onActionUpdate: (action: Action) => void,
  currentUser: User | null
) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentUser) return;

    // Simulate real-time updates every 10-15 seconds
    intervalRef.current = setInterval(() => {
      // Simulate other users making changes
      const otherUsers = [
        { id: '1', email: 'alice@example.com', name: 'Alice Johnson' },
        { id: '2', email: 'bob@example.com', name: 'Bob Smith' },
        { id: '3', email: 'charlie@example.com', name: 'Charlie Brown' },
        { id: '4', email: 'diana@example.com', name: 'Diana Prince' },
      ].filter(user => user.id !== currentUser.id);

      if (tasks.length > 0 && Math.random() < 0.3) {
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        
        // Simulate task status change
        const statuses: Task['status'][] = ['Todo', 'In Progress', 'Done'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const updatedTask = {
          ...randomTask,
          status: newStatus,
          updatedAt: new Date(),
        };

        onTaskUpdate(updatedTask);

        // Create action log
        const action: Action = {
          id: Date.now().toString(),
          user: randomUser,
          action: `moved task "${randomTask.title}" to ${newStatus}`,
          timestamp: new Date(),
          taskId: randomTask.id,
        };

        onActionUpdate(action);
      }
    }, 12000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tasks, currentUser, onTaskUpdate, onActionUpdate]);
};