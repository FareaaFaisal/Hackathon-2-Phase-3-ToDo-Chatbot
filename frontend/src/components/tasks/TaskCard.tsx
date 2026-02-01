// frontend/src/components/tasks/TaskCard.tsx
'use client';

import React from 'react';
import { Task } from '@/lib/data-models';
import Button from '../common/Button';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: number | string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number | string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const handleToggle = () => {
    onToggleComplete(task.id, !task.completed);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`relative flex items-start justify-between p-4 mb-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4
      ${task.completed ? 'border-green-500 bg-card/60' : 'border-blue-500 bg-card'}`}
    >
      <div className="flex items-start flex-grow">
        <input
          id={`task-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="h-6 w-6 mt-1 mr-4 cursor-pointer rounded-full text-primary focus:ring-primary/50"
        />

        <label htmlFor={`task-${task.id}`} className="flex-grow cursor-pointer">
          <h3
            className={`text-lg font-bold ${
              task.completed ? 'line-through text-gray-500' : 'text-foreground'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm mt-1 ${
                task.completed
                  ? 'line-through text-gray-500/80'
                  : 'text-foreground/80'
              }`}
            >
              {task.description}
            </p>
          )}

          <p className="text-xs mt-2 text-foreground/50">
            Created:{' '}
            {task.created_at
              ? new Date(task.created_at).toLocaleDateString()
              : '—'}
          </p>

        </label>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="p-2 rounded-full"
        >
          ✏️
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="p-2 rounded-full"
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
