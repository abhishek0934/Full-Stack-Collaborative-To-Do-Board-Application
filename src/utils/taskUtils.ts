import { Task, User } from '../types';

export const getTasksByStatus = (tasks: Task[], status: string) => {
  return tasks.filter(task => task.status === status);
};

export const getSmartAssignUser = (users: User[], tasks: Task[]): User | null => {
  if (users.length === 0) return null;
  
  const userTaskCounts = users.map(user => ({
    user,
    activeTasks: tasks.filter(task => 
      task.assignedUser?.id === user.id && task.status !== 'Done'
    ).length
  }));
  
  userTaskCounts.sort((a, b) => a.activeTasks - b.activeTasks);
  return userTaskCounts[0].user;
};

export const detectConflict = (task: Task, editingUser: User): boolean => {
  return task.editingBy !== undefined && task.editingBy.id !== editingUser.id;
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Todo': return 'bg-blue-50 border-blue-200';
    case 'In Progress': return 'bg-orange-50 border-orange-200';
    case 'Done': return 'bg-green-50 border-green-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};