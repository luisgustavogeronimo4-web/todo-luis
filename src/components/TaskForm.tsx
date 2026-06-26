import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/Task";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  initialData?: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  };
  isSubmitting?: boolean;
}

export const TaskForm = ({ onSubmit, initialData, isSubmitting }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [priority, setPriority] = useState(initialData?.priority || "medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ 
      title: title.trim(), 
      description: description.trim(), 
      due_date: dueDate, 
      priority: priority 
    });
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
      <div className="flex items-center mb-2">
        <label className="mr-2">Due Date:</label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
      <div className="flex items-center mb-2">
        <label className="mr-2">Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          disabled={isSubmitting}
          className="w-full"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <Button type="submit" disabled={isSubmitting || !title.trim()} className="w-full">
        {isSubmitting ? "Saving..." : "Save Task"}
      </Button>
    </form>
  );
};