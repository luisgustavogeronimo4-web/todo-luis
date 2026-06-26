import { useState, useEffect, useMemo } from "react";
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
import { TaskFilters } from "@/components/TaskFilters";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TaskModal } from "@/components/TaskModal";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types/Task";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

  // filter and sort state
  const [filterBy, setFilterBy] = useState<"all" | "completed" | "pending">("all");
  const [sortBy, setSortBy] = useState<"created" | "due" | "priority">("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  // Apply filters and sorting
  const filteredAndSortedTasks = useMemo(() => {
    let tasks = [...activeTasks];
    
    // Apply filter
    if (filterBy === "completed") {
      tasks = tasks.filter(t => t.completed);
    } else if (filterBy === "pending") {
      tasks = tasks.filter(t => !t.completed);
    }
    
    // Apply sorting
    tasks.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "created") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "due") {
        if (!a.due_date && !b.due_date) comparison = 0;
        else if (!a.due_date) comparison = 1;
        else if (!b.due_date) comparison = -1;
        else comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority || "medium"];
        const bPriority = priorityOrder[b.priority || "medium"];
        comparison = aPriority - bPriority;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return tasks;
  }, [activeTasks, filterBy, sortBy, sortOrder]);

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
    <>
      <Header />
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
            <CardContent className="space-y-4">
              <TaskForm
                key={formKey}
                onSubmit={handleCreate}
                isSubmitting={isCreating}
              />
            </CardContent>
          </Card>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <TaskFilters
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={setSortBy}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
            />
          </div>

          {/* Active tasks */}
          <section>
            <h2 className="text-lg font-medium text-zinc-200 mb-2">Tarefas Ativas</h2>
            {filteredAndSortedTasks.length === 0 ? (
              <p className="text-center text-zinc-400 py-8">
                Nenhuma tarefa ativa encontrada. Crie sua primeira tarefa acima!
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAndSortedTasks.map((task) => (
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
            <h2 className="text-lg font-medium text-zinc-200 mb-2">Lixeira</h2>
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
            <Link to="/" className="text-sm">
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
      <Footer />
    </>
  );
};

export default Tasks;