import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TaskModal } from "@/components/TaskModal";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types/Task";
import { toast } from "sonner";

export const Tasks = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [trashTasks, setTrashTasks] = useState<Task[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // key to reset TaskForm after successful create
  const [formKey, setFormKey] = useState(0);

  const loadTasks = async () => {
    try {
      const [active, deleted] = await Promise.all([
        taskService.getActive(),
        taskService.getDeleted(),
      ]);
      setActiveTasks(active);
      setTrashTasks(deleted);
    } catch (err: any) {
      console.error("loadTasks error:", err.message);
      toast.error("Failed to load tasks");
    }
  };

  // reload when auth changes
  useEffect(() => {
    if (user?.id) loadTasks();
  }, [user?.id]);

  const handleCreate = async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
    setIsCreating(true);
    try {
      const created = await taskService.create(task);
      if (created && !created.completed) {
        setActiveTasks((prev) => [created, ...prev]);
      }
      toast.success("Task created");
      setFormKey((k) => k + 1);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await taskService.update(task.id, { completed: !task.completed });
      setActiveTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
      );
      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const openConfirm = (title: string, description: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const handleUpdate = (task: Task) => {
    setEditTask(task);
    setEditOpen(true);
  };

  const submitEdit = async (data: Omit<Task, "id" | "created_at" | "updated_at">) => {
    if (!editTask) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja salvar as alterações nesta tarefa?",
    );
    if (!confirmed) return;

    setIsUpdating(editTask.id);
    try {
      const updated = await taskService.update(editTask.id, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      setActiveTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      toast.success("Task updated");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update task");
    } finally {
      setIsUpdating(null);
      setEditOpen(false);
      setEditTask(null);
    }
  };

  const handleDelete = (id: string) => {
    openConfirm(
      "Mover para lixeira",
      "Deseja mover esta tarefa para a lixeira?",
      async () => {
        try {
          const ok = await taskService.softDelete(id);
          if (ok) {
            setActiveTasks((prev) => prev.filter((t) => t.id !== id));
            const trash = await taskService.getDeleted();
            setTrashTasks(trash);
            toast.success("Task moved to trash");
          } else {
            toast.error("Failed to move task");
          }
        } catch {
          toast.error("Failed to move task");
        }
      },
    );
  };

  const handleRestore = (id: string) => {
    openConfirm(
      "Restaurar tarefa",
      "Deseja restaurar esta tarefa?",
      async () => {
        try {
          const ok = await taskService.restore(id);
          if (ok) {
            const active = await taskService.getActive();
            setActiveTasks(active);
            const trash = await taskService.getDeleted();
            setTrashTasks(trash);
            toast.success("Task restored");
          } else {
            toast.error("Failed to restore task");
          }
        } catch {
          toast.error("Failed to restore task");
        }
      },
    );
  };

  const handlePermanentDelete = (id: string) => {
    openConfirm(
      "Excluir permanentemente",
      "Deseja excluir permanentemente esta tarefa?",
      async () => {
        try {
          const ok = await taskService.deletePermanently(id);
          if (ok) {
            setTrashTasks((prev) => prev.filter((t) => t.id !== id));
            toast.success("Task permanently deleted");
          } else {
            toast.error("Failed to delete task");
          }
        } catch {
          toast.error("Failed to delete task");
        }
      },
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-50 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
        {/* Header */}
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl text-zinc-100">Task Manager</CardTitle>
            <CardDescription className="text-zinc-400">
              Gerencie suas tarefas com criação, edição e exclusão.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskForm
              key={formKey}
              onSubmit={handleCreate}
              isSubmitting={isCreating}
            />
          </CardContent>
        </Card>

        {/* Active tasks */}
        <section>
          <h2 className="text-lg font-medium text-zinc-200 mb-4">Tarefas Ativas</h2>
          {activeTasks.length === 0 ? (
            <p className="text-center text-zinc-400 py-8">
              Nenhuma tarefa ainda. Crie sua primeira tarefa acima!
            </p>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleUpdate}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trash */}
        <section>
          <h2 className="text-lg font-medium text-zinc-200 mb-4">Lixeira</h2>
          {trashTasks.length === 0 ? (
            <p className="text-center text-zinc-400 py-8">Lixeira vazia.</p>
          ) : (
            <div className="space-y-3">
              {trashTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onRestore={handleRestore}
                  onDeletePermanently={handlePermanentDelete}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer actions */}
        <CardFooter className="flex justify-between">
          <Link to="/">
            <Button variant="outline" className="bg-zinc-800 hover:bg-zinc-700">
              Voltar ao início
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </CardFooter>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={confirmAction}
        confirmText="Confirmar"
        cancelText="Cancelar"
        variant="default"
      />

      <TaskModal
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={submitEdit}
        initialData={
          editTask ? { title: editTask.title, description: editTask.description } : undefined
        }
        isSubmitting={isUpdating !== null}
      />
    </div>
  );
};

export default Tasks;