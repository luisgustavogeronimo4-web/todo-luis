import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/Task";
import { Star } from "lucide-react";

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
    <div className="relative">
      {/* Star accents */}
      <div className="absolute top-2 left-2 opacity-10 pointer-events-none">
        <Star className="h-5 w-5 text-red-600" />
      </div>
      <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
        <Star className="h-5 w-5 text-white" />
      </div>
      
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4 -rotate-1">
        <div className="className="-rotate-1">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0 -rotate-1"
          />
        </div>
        <div className="-rotate-1">
          <Textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="w-full bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0 -rotate-1"
          />
        </div>
        <div className="flex items-center mb-2 -rotate-1">
          <label className="mr-2 text-white font-bold">Due Date:</label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0"
          />
        </div>
        <div className="flex items-center mb-2 -rotate-1">
          <label className="mr-2 text-white font-bold">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            disabled={isSubmitting}
            className="w-full bg-zinc-800 border-2 border-red-600 text-white focus:border-red-400 focus:ring-0"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <Button type="submit" disabled={isSubmitting || !title.trim()} className="w-full bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1 transition-colors">
          {isSubmitting ? "Saving..." : "Save Task"}
        </Button>
      </form>
    </div>
  );
};