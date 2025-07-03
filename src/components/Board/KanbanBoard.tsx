import React, { useState, useEffect } from 'react';
import { Task, User, Action } from '../../types';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Plus, Users, Activity } from 'lucide-react';
import { getTasksByStatus, getSmartAssignUser } from '../../utils/taskUtils';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  currentUser: User;
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onActionCreate: (action: Omit<Action, 'id' | 'timestamp'>) => void;
  onShowActivityLog: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  users,
  currentUser,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onActionCreate,
  onShowActivityLog,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>('Todo');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: { title: Task['status']; color: string }[] = [
    { title: 'Todo', color: 'bg-blue-50 border-blue-200' },
    { title: 'In Progress', color: 'bg-orange-50 border-orange-200' },
    { title: 'Done', color: 'bg-green-50 border-green-200' },
  ];

  const handleCreateTask = (status: Task['status']) => {
    setSelectedStatus(status);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        ...taskData,
        updatedAt: new Date(),
      };
      onTaskUpdate(updatedTask);
      onActionCreate({
        user: currentUser,
        action: `updated task "${taskData.title}"`,
        taskId: editingTask.id,
      });
    } else {
      onTaskCreate(taskData);
      onActionCreate({
        user: currentUser,
        action: `created task "${taskData.title}"`,
      });
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskDelete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onTaskDelete(taskId);
      onActionCreate({
        user: currentUser,
        action: `deleted task "${task.title}"`,
        taskId,
      });
    }
  };

  const handleSmartAssign = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const smartUser = getSmartAssignUser(users, tasks);
      if (smartUser) {
        const updatedTask = {
          ...task,
          assignedUser: smartUser,
          updatedAt: new Date(),
        };
        onTaskUpdate(updatedTask);
        onActionCreate({
          user: currentUser,
          action: `smart assigned task "${task.title}" to ${smartUser.name}`,
          taskId,
        });
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      const updatedTask = {
        ...draggedTask,
        status: newStatus,
        updatedAt: new Date(),
      };
      onTaskUpdate(updatedTask);
      onActionCreate({
        user: currentUser,
        action: `moved task "${draggedTask.title}" to ${newStatus}`,
        taskId: draggedTask.id,
      });
    }
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Collaborative Task Board
            </h1>
            <p className="text-gray-600">
              Welcome back, {currentUser.name}! Manage your tasks effectively.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {users.length} Users
              </span>
            </div>
            <button
              onClick={onShowActivityLog}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Activity className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Activity Log</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(tasks, column.title);
            return (
              <div
                key={column.title}
                className={`${column.color} rounded-lg p-4 min-h-[600px] border-2 border-dashed transition-all duration-200`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.title)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {column.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                      {columnTasks.length}
                    </span>
                    <button
                      onClick={() => handleCreateTask(column.title)}
                      className="bg-white text-gray-600 hover:text-blue-600 p-1 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="cursor-move"
                    >
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleTaskDelete}
                        onSmartAssign={handleSmartAssign}
                        currentUser={currentUser}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          users={users}
          defaultStatus={selectedStatus}
          onSubmit={handleTaskSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;