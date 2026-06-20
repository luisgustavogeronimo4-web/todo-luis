import type { Task } from "@/types/Task";

const TASKS_STORAGE_KEY = "tasks";

export const taskService = {
  getAll: (): Task[] => {
    const stored = window.localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) as Task[] : [];
  },

  getById: (id: number): Task | undefined => {
    const tasks = taskService.getAll();
    return tasks.find((t) => t.id === id);
  },

  create: (task: Omit<Task, "id" | "createdAt">): Task => {
    const tasks = taskService.getAll();
    const newTask: Task = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    const updated = [...tasks, newTask];
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
    return newTask;
  },

  update: (id: number, updates: Partial<Task>): Task | null => {
    const tasks = taskService.getAll();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    
    tasks[index] = { ...tasks[index], ...updates };
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return tasks[index];
  },

  delete: (id: number): boolean => {
    const tasks = taskService.getAll();
    const filtered = tasks.filter((t) => t.id !== id);
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  toggleComplete: (id: number): Task | null => {
    const task = taskService.getById(id);
    if (!task) return null;
    return taskService.update(id, { completed: !task.completed });
  },
};
</arg_value>
<dyad-write path="src/components/TaskForm.tsx" description="Criando formulário para criar/editar tarefas.">
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/Task";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  initialData?: {
    title: string;
    description: string;
  };
  isSubmitting?: boolean;
}

export const TaskForm = ({ onSubmit, initialData, isSubmitting }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={3}
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={isSubmitting || !title.trim()} className="w-full">
        {isSubmitting ? "Saving..." : "Save Task"}
      </Button>
    </form>
  );
};