import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/Task";

const TABLE_NAME = "tasks";

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }
  return data.user.id;
}

export const taskService = {
  async getActive(): Promise<Task[]> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }
    
    return (data || []).filter((t) => t && !t.completed);
  },

  async getDeleted(): Promise<Task[]> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (error) {
      return [];
    }
    return data || [];
  },

  async create(
    task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id" | "deleted_at">,
  ): Promise<Task> {
    const userId = await getCurrentUserId();

    const { title, description, due_date, priority } = task;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({ 
        title,
        description,
        due_date,
        priority,
        user_id: userId,
        completed: false
      })
      .select()
      .single();

    if (error) {
      throw new Error("Erro ao criar tarefa.");
    }
    return data as Task;
  },

  async update(
    taskId: string,
    updates: Partial<Omit<Task, "id" | "created_at" | "updated_at" | "user_id" | "deleted_at">>,
  ): Promise<Task> {
    const userId = await getCurrentUserId();

    // CORREÇÃO DO CRITICAL: Removido completamente o 'deleted_at' da lista de modificações permitidas.
    const { title, description, due_date, priority, completed } = updates;
    
    const safeUpdates: Record<string, any> = {};
    if (title !== undefined) safeUpdates.title = title;
    if (description !== undefined) safeUpdates.description = description;
    if (due_date !== undefined) safeUpdates.due_date = due_date;
    if (priority !== undefined) safeUpdates.priority = priority;
    if (completed !== undefined) safeUpdates.completed = completed;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(safeUpdates)
      .eq("id", taskId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error("Erro ao atualizar tarefa.");
    }
    return data as Task;
  },

  async softDelete(taskId: string): Promise<boolean> {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      return false;
    }
    return true;
  },

  async restore(taskId: string): Promise<boolean> {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ deleted_at: null })
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      return false;
    }
    return true;
  },

  async deletePermanently(taskId: string): Promise<boolean> {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      return false;
    }
    return true;
  },
};