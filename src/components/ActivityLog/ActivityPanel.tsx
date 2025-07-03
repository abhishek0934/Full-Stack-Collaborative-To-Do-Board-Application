import React, { useEffect, useRef } from 'react';
import { Action } from '../../types';
import { X, Activity, Clock, User, FileText } from 'lucide-react';

interface ActivityPanelProps {
  actions: Action[];
  isOpen: boolean;
  onClose: () => void;
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ actions, isOpen, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [actions]);

  if (!isOpen) return null;

  const getActionIcon = (action: string) => {
    if (action.includes('created')) return <FileText className="w-4 h-4 text-green-600" />;
    if (action.includes('updated')) return <FileText className="w-4 h-4 text-blue-600" />;
    if (action.includes('deleted')) return <FileText className="w-4 h-4 text-red-600" />;
    if (action.includes('moved')) return <FileText className="w-4 h-4 text-orange-600" />;
    if (action.includes('assigned')) return <User className="w-4 h-4 text-purple-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
                <p className="text-gray-600">Last 20 actions across all tasks</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="p-6 max-h-[60vh] overflow-y-auto">
          {actions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activities yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start creating and managing tasks to see activity here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(action.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {action.user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {action.user.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{action.action}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(action.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {actions.length} recent activities</span>
            <span>Auto-refreshes in real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;