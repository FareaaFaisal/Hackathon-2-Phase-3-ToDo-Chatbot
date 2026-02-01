// frontend/src/components/tasks/TaskList.tsx
'use client';

import React from 'react';
import { Task } from '@/lib/data-models';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string | number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string | number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500 bg-white rounded-lg shadow-md">
        <p className="text-lg font-medium">No tasks yet!</p>
        <p className="text-sm mt-2">Start by adding a new task to your list.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete} 
          onEdit={onEdit}
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default TaskList;
