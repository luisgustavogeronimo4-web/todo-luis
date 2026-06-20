import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { api } from '@/services/api';
import { toast } from 'sonner';

export const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskAdded = () => {
    loadTasks();
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleTaskDeleted = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="animate-pulse">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
          
          <TaskForm onTaskAdded={handleTaskAdded} />
          
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks yet. Add one above!</p>
            </div>
          )}
          
          {tasks.length > 0 && (
            <div className="mt-6 space-y-3">
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleTaskUpdated}
                  onDelete={handleTaskDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};