import React, { useState, useEffect } from 'react';
import { Task, User, Action, AuthState } from './types';
import { getAuthState, clearAuthState, mockUsers } from './utils/auth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import KanbanBoard from './components/Board/KanbanBoard';
import ActivityPanel from './components/ActivityLog/ActivityPanel';
import { LogOut } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [authState, setAuthState] = useState<AuthState>(() => getAuthState());
  const [showRegister, setShowRegister] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [tasks, setTasks] = useLocalStorage<Task[]>('collaborative_tasks', []);
  const [actions, setActions] = useLocalStorage<Action[]>('collaborative_actions', []);

  // Initialize with mock users
  const [users] = useState<User[]>(mockUsers);

  // Handle authentication
  const handleLogin = (user: User, token: string) => {
    setAuthState({ user, token, isAuthenticated: true });
  };

  const handleLogout = () => {
    clearAuthState();
    setAuthState({ user: null, token: null, isAuthenticated: false });
  };

  // Task management
  const handleTaskCreate = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Action logging
  const handleActionCreate = (actionData: Omit<Action, 'id' | 'timestamp'>) => {
    const newAction: Action = {
      ...actionData,
      id: uuidv4(),
      timestamp: new Date(),
    };
    setActions(prev => {
      const updated = [...prev, newAction];
      // Keep only the last 20 actions
      return updated.slice(-20);
    });
  };

  // Real-time updates simulation
  useRealTimeUpdates(tasks, handleTaskUpdate, handleActionCreate, authState.user);

  // If not authenticated, show login/register
  if (!authState.isAuthenticated) {
    return showRegister ? (
      <RegisterForm
        onRegister={handleLogin}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">CT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CollaborativeTask</h1>
                <p className="text-sm text-gray-600">Real-time collaboration made easy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {authState.user?.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {authState.user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <KanbanBoard
        tasks={tasks}
        users={users}
        currentUser={authState.user!}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onActionCreate={handleActionCreate}
        onShowActivityLog={() => setShowActivityLog(true)}
      />

      {/* Activity Log Panel */}
      <ActivityPanel
        actions={actions}
        isOpen={showActivityLog}
        onClose={() => setShowActivityLog(false)}
      />
    </div>
  );
}

export default App;