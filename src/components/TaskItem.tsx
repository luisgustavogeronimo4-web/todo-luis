"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, RotateCcw, Trash } from "lucide-react";
import type { Task } from "@/types/Task";

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onRestore?: (taskId: string) => void;
  onDeletePermanently?: (taskId: string) => void;
  onToggleComplete?: (task: Task) => void;
}

/**
 * The Supabase table uses `completed` (boolean) and `deleted_at` (timestamp|null).
 * The original code referenced `is_completed` / `is_deleted`, which caused runtime errors.
 * We now read the correct fields and guard against null task objects.
 */
export const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently,
  onToggleComplete,
}: TaskItemProps) => {
  if (!task) return null;

  const isDeleted = !!task.deleted_at;
  const isCompleted = !!task.completed;

  return (
    <Card className="p-4 mb-3">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isCompleted}
          className="mt-1"
          disabled={isDeleted}
          onCheckedChange={() => onToggleComplete?.(task)}
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
          {task.due_date && (
            <p className="text-sm text-gray-600 mt-1">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}
          {task.priority && (
            <p className="text-sm text-gray-600 mt-1">
              Priority: {task.priority}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {isDeleted ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => onRestore?.(task.id)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja apagar esta tarefa permanentemente?")) {
                    onDeletePermanently?.(task.id);
                  }
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(task)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja mover esta tarefa para a lixeira?")) {
                    onDelete?.(task.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};