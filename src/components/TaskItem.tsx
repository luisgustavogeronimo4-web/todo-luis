import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import { useState } from 'react';
import { toast } from 'sonner';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onUpdate, onDelete }: TaskItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleToggle = async () => {
    try {
      const updatedTask = await api.updateTask(task.id, {
        completed: !task.completed
      });
      onUpdate(updatedTask);
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const updatedTask = await api.updateTask(task.id, {
        title: editTitle,
        description: editDescription
      });
      onUpdate(updatedTask);
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteTask(task.id);
      onDelete(task.id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          className="h-4 w-4"
        />
        <div>
          <h3 className={`${task.completed ? 'line-through text-gray-500' : 'font-medium'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`${task.completed ? 'line-through text-gray-400' : 'text-sm text-gray-600'}`}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="ml-auto flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setEditTitle(task.title);
              setEditDescription(task.description);
            }}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};