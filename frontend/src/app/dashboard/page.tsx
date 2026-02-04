'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CanvasBackground from '@/components/common/CanvasBackground';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Toast from '@/components/common/Toast';
import Spinner from '@/components/common/Spinner';
import { api } from '@/lib/api';
import { Task } from '@/lib/data-models';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Task[]>('/tasks'); // strongly typed
      setTasks(data);
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to fetch tasks.');
      setToastVariant('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task =>
        filterStatus === 'all'
          ? true
          : filterStatus === 'completed'
          ? task.completed
          : !task.completed
      )
      .sort((a, b) => {
        const val =
          sortBy === 'title'
            ? a.title.localeCompare(b.title)
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? val : -val;
      });
  }, [tasks, filterStatus, sortBy, sortOrder]);

  const openCreateModal = () => {
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description || '');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveTask = async () => {
    if (!newTaskTitle.trim()) {
      setToastMessage('Task title cannot be empty.');
      setToastVariant('error');
      return;
    }
    setIsSaving(true);

    try {
      if (editingTask) {
        // Update task
        const updatedTask = await api.put<Task>(`/tasks/${editingTask.id}`, {
          title: newTaskTitle,
          description: newTaskDescription,
        });
        setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
        setToastMessage('Task updated successfully!');
      } else {
        // Create task
        const newTask = await api.post<Task>('/tasks', {
          title: newTaskTitle,
          description: newTaskDescription,
        });
        setTasks(prev => [...prev, newTask]);
        setToastMessage('Task created successfully!');
      }
      setToastVariant('success');
      closeModal();
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to save task.');
      setToastVariant('error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      const updated = await api.put<Task>(`/tasks/${task.id}`, { completed: !task.completed });
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to update task.');
      setToastVariant('error');
    }
  };

const deleteTask = async (task: Task) => {
  try {
    await api.del(`/tasks/${task.id}`); // ✅ Correct: api.ts already has /api/v1
    setTasks(prev => prev.filter(t => t.id !== task.id));
    setToastMessage('Task deleted successfully!');
    setToastVariant('success');
  } catch (err: any) {
    setToastMessage(err.message || 'Failed to delete task.');
    setToastVariant('error');
  }
};




  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      <CanvasBackground />

      <div className="w-full max-w-4xl p-8 bg-black/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <div className='flex p-2 gap-8'> 
             <Button onClick={openCreateModal} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center">
            Add Task
          </Button>
            
             <Button 
  onClick={() => {
    localStorage.clear();     // ✅ clears token + user data
    window.location.href = '/login';
  }} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center"
>
  Logout
</Button>

          
          </div>
         
          

        </header>

        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-6 flex flex-wrap gap-4 justify-between items-center scroll-auto">
          <div className="flex gap-2 items-center">
            <label className="text-white font-semibold">Filter:</label>
            <select
              className="bg-white/10 text-white px-3 py-1 rounded-lg"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
            >
              <option value="all" className="text-black">All</option>
              <option value="pending" className="text-black">Pending</option>
              <option value="completed" className="text-black">Completed</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-white font-semibold">Sort By:</label>
            <select
              className="bg-white/10 text-white px-3 py-1 rounded-lg"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
            >
              <option value="created_at" className="text-black">Date</option>
              <option value="title" className="text-black">Title</option>
            </select>
            <select
              className="bg-white/10 text-white px-3 py-1 rounded-lg"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
            >
              <option value="asc" className="text-black">Asc</option>
              <option value="desc" className="text-black">Desc</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <p className="text-center text-white/70">No tasks found.</p>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-xl shadow-md border border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:scale-[1.01] bg-black/30`}
              >
                <div>
                  <h2 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {task.title}
                  </h2>
                  <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-white/70'}`}>
                    {task.description}
                  </p>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <Button
                    onClick={() => toggleComplete(task)}
                    className={task.completed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}
                  >
                    {task.completed ? 'Completed' : 'Mark Done'}
                  </Button>
                  <Button onClick={() => openEditModal(task)} variant="secondary">Edit</Button>
                  <Button onClick={() => deleteTask(task)} variant="secondary">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'Create Task'}>
          <div className="space-y-4">
            <Input id="taskTitle" label="Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} disabled={isSaving} className="text-black" />
            <Input id="taskDescription" label="Description" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} disabled={isSaving} className="text-black" />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" className="border-black text-black" onClick={closeModal} disabled={isSaving}>Cancel</Button>
            <Button className="border-black text-black" onClick={handleSaveTask} isLoading={isSaving} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </div>
        </Modal>
      )}

      {toastMessage && <Toast message={toastMessage} variant={toastVariant} onClose={() => setToastMessage(null)} />}
   

    </div>
  );
}
