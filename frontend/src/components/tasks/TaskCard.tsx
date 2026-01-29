// frontend/src/components/tasks/TaskCard.tsx
'use client';

import React from 'react';
import { Task } from '@/lib/data-models';
import Button from '../common/Button';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const handleToggle = () => {
    onToggleComplete(task.id, !task.completed);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`relative flex items-start justify-between p-4 bg-card rounded-xl shadow-md mb-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 ${task.completed ? 'border-green-500 bg-card/60' : 'border-blue-500'}`}>
      <div className="flex items-start flex-grow">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="form-checkbox h-6 w-6 text-primary rounded-full mt-1 mr-4 cursor-pointer focus:ring-primary/50"
        />
        <div className="flex-grow">
          <h3 className={`text-lg font-bold text-foreground ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
          <p className={`text-foreground/80 text-sm mt-1 ${task.completed ? 'line-through text-gray-500/80' : ''}`}>{task.description}</p>
          <p className="text-foreground/50 text-xs mt-2">Created: {new Date(task.created_date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-2 ml-4">
        <Button variant="ghost" size="sm" onClick={handleEdit} className="p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
          </svg>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
