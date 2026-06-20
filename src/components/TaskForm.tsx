import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface TaskFormProps {
  onTaskAdded: () => void;
  initialData?: {
    title: string;
    description: string;
  };
}

export const TaskForm = ({ onTaskAdded, initialData }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await api.createTask({ title, description });
      toast.success('Task created successfully');
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={3}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Add Task'}
      </Button>
    </form>
  );
};