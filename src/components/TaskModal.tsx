import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/Task";
import { Star } from "lucide-react";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: { title: string; description?: string; due_date?: string; priority?: "low" | "medium" | "high" }) => void;
  initialData?: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  };
  isSubmitting?: boolean;
}

export const TaskModal = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting,
}: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setDueDate(initialData?.due_date || "");
      setPriority(initialData?.priority || "medium");
      setError(null);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate due date is not in the past
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setError("Due date cannot be in the past");
        return;
      }
    }
    
    setError(null);
    
    if (!title.trim()) return;
    onSubmit({ 
      title: title.trim(), 
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
      priority: priority,
    });
  };

  // Get priority color class
  const getPriorityClass = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-4 border-red-600 -rotate-1 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)]">
        {/* Star accents */}
        <div className="absolute top-2 left-2 opacity-10 pointer-events-none">
          <Star className="h-5 w-5 text-red-600" />
        </div>
        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
          <Star className="h-5 w-5 text-white" />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 border-l-4 border-red-600 text-red-300 -rotate-1">
            {error}
          </div>
        )}
        
        <DialogHeader>
          <DialogTitle className="text-red-600 -rotate-1">
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="-rotate-1">
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
              <option value="low" className="bg-green-500/20 text-green-400">Low</option>
              <option value="medium" className="bg-yellow-500/20 text-yellow-400">Medium</option>
              <option value="high" className="bg-red-500/20 text-red-400">High</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 -rotate-1">
            <span className="text-xs text-white/60">
              Priority colors: 
              <span className="px-2 py-1 rounded text-xs font-medium">Low</span>
              <span className="px-2 py-1 rounded text-xs font-medium ml-1">Medium</span>
              <span className="px-2 py-1 rounded text-xs font-medium ml-1">High</span>
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 -rotate-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()} className="bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1">
              {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};