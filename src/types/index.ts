export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedUser: User | null;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  updatedAt: Date;
  editingBy?: User;
}

export interface Action {
  id: string;
  user: User;
  action: string;
  timestamp: Date;
  taskId?: string;
  details?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AppState {
  tasks: Task[];
  users: User[];
  actions: Action[];
  auth: AuthState;
}