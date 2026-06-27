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
import { Star } from "lucide-react";

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

  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [filterBy, setFilterBy] = useState<"all" | "completed" | "pending">("all");
  const [sortBy, setSortBy] = useState<"created" | "due" | "priority">("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    if (user?.id) loadTasks();
  }, [user?.id]);

  const filteredAndSortedTasks = useMemo(() => {
    let tasks = [...activeTasks];
    
    // Apply search filter
    if (searchQuery) {
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      );
    }
    
    // Apply filterBy
    if (filterBy === "completed") tasks = tasks.filter((t) => t.completed);
    else if (filterBy === "pending") tasks = tasks.filter((t) => !t.completed);
    
    // Apply sort
    tasks.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "created")
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortBy === "due") {
        if (!a.due_date && !b.due_date) comparison = 0;
        else if (!a.due_date) comparison = 1;
        else if (!b.due_date) comparison = -1;
        else comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (sortBy === "priority") {
        const order = { high: 3, medium: 2, low: 1 };
        comparison = (order[a.priority || "medium"] ?? 2) - (order[b.priority || "medium"] ?? 2);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return tasks;
  }, [activeTasks, filterBy, sortBy, sortOrder, searchQuery]);

  const handleCreate = async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
    setIsCreating(true);
    try {
      const created = await taskService.create(task);
      if (created && !created.completed) setActiveTasks((prev) => [created, ...prev]);
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
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
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

  const submitEdit = async (data: { title: string; description?: string; due_date?: string; priority?: "low" | "medium" | "high" }) => {
    if (!editTask) return;
    const confirmed = window.confirm("Tem certeza que deseja salvar as alterações?");
    if (!confirmed) return;
    setIsUpdating(editTask.id);
    try {
      const updated = await taskService.update(editTask.id, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      setActiveTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
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
    openConfirm("Mover para lixeira", "Deseja mover esta tarefa para a lixeira?", async () => {
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
    });
  };

  const handleRestore = (id: string) => {
    openConfirm("Restaurar tarefa", "Deseja restaurar esta tarefa?", async () => {
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
    });
  };

  const handlePermanentDelete = (id: string) => {
    openConfirm("Excluir permanentemente", "Deseja excluir permanentemente esta tarefa?", async () => {
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
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Header />
      {/* Halftone background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none z-0" />
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Star className="absolute top-4 left-4 w-8 h-8 fill-current text-white opacity-20 rotate-12" />
        <Star className="absolute top-1/3 right-8 w-6 h-6 fill-current text-white opacity-20 -rotate-45" />
        <Star className="absolute bottom-12 left-1/4 w-10 h-10 fill-current text-white opacity-20 rotate-6" />
        <Star className="absolute bottom-4 right-4 w-5 h-5 fill-current text-white opacity-20 -rotate-12" />
        <Star className="absolute top-1/2 left-1/2 w-12 h-12 fill-current text-white opacity-20 rotate-45" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen w-full mx-auto max-w-md md:max-w-xl p-4">
        <div className="w-full bg-zinc-900 border-4 border-black -rotate-1 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)] p-6">
          <Card className="bg-white border-red-600 -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 -rotate-1">Task Manager</CardTitle>
              <CardDescription className="text-red-600 -rotate-2">
                Gerencie suas tarefas com estilo Acid Punk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskForm key={formKey} onSubmit={handleCreate} isSubmitting={isCreating} />
            </CardContent>
          </Card>

          {/* Fixed layout for filters and search - prevents overflow */}
          <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6 mt-6">
            <div className="w-full sm:flex-1">
              <TaskFilters
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={setSortBy}
                filterBy={filterBy}
                onFilterChange={setFilterBy}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>

          <section className="border-red-600 -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-lg font-medium text-red-600 mb-2 -rotate-1">Tarefas Ativas</h2>
            {filteredAndSortedTasks.length === 0 ? (
              <p className="text-center text-red-600 py-8">
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

          <section className="border-black -rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-8">
            <h2 className="text-lg font-medium text-red-600 mb-2 -rotate-1">Lixeira</h2>
            {trashTasks.length === 0 ? (
              <p className="text-center text-red-600 py-8">Lixeira vazia.</p>
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

          <CardFooter className="flex justify-between border-red-600 -rotate-2 mt-6">
            <Link to="/" className="text-sm">
              <Button
                variant="outline"
                className="bg-white border-4 border-black text-black font-black hover:bg-gray-100"
              >
                Voltar ao início
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="border-4 border-black text-black font-black hover:bg-white"
            >
              Sair
            </Button>
          </CardFooter>
        </div>

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
            editTask ? { 
              title: editTask.title, 
              description: editTask.description,
              due_date: editTask.due_date,
              priority: editTask.priority
            } : undefined
          }
          isSubmitting={isUpdating !== null}
        />
      </div>
      <Footer />
    </>
  );
};

export default Tasks;