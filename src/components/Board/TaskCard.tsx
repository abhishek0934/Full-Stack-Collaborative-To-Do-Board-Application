import React, { useState } from 'react';
import { Task, User } from '../../types';
import { Edit2, Trash2, Clock, AlertCircle, UserCheck } from 'lucide-react';
import { getPriorityColor } from '../../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onSmartAssign: (taskId: string) => void;
  currentUser: User;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onSmartAssign,
  currentUser,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConflictWarning, setShowConflictWarning] = useState(false);

  const handleEditClick = () => {
    if (task.editingBy && task.editingBy.id !== currentUser.id) {
      setShowConflictWarning(true);
      setTimeout(() => setShowConflictWarning(false), 3000);
    } else {
      onEdit(task);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
        task.editingBy && task.editingBy.id !== currentUser.id
          ? 'ring-2 ring-yellow-400 ring-opacity-50'
          : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showConflictWarning && (
        <div className="mb-3 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          {task.editingBy?.name} is currently editing this task
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 flex-1 pr-2">{task.title}</h3>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isHovered && (
            <>
              <button
                onClick={handleEditClick}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          
          {task.assignedUser ? (
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {task.assignedUser.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs text-gray-600">{task.assignedUser.name}</span>
            </div>
          ) : (
            <button
              onClick={() => onSmartAssign(task.id)}
              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Smart Assign</span>
            </button>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(task.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {task.editingBy && task.editingBy.id !== currentUser.id && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Being edited by {task.editingBy.name}
        </div>
      )}
    </div>
  );
};

export default TaskCard;