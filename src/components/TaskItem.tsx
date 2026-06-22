"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, RotateCcw, Trash } from "lucide-react";
import type { Task } from "@/types/Task";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRestore: (task: Task) => void;
  onDeletePermanently: (task: Task) => void;
}

export const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently,
}: TaskItemProps) => {
  const isDeleted = task.is_deleted;

  return (
    <Card className="p-4 mb-3">
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.is_completed} 
          className="mt-1" 
          disabled 
        />
        <div className="flex-1">
          <h3 className={isDeleted ? "line-through text-gray-500" : "font-medium"}>
            {task.title}
          </h3>
          {task.description && (
            <p className={isDeleted ? "line-through text-gray-400 text-sm" : "text-sm text-gray-600"}>
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1">
          {isDeleted ? (
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRestore(task)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDeletePermanently(task)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(task)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};