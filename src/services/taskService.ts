import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/Task";

const TABLE_NAME = "tasks";

/**
 * Helper – fetch the current authenticated user.
 * Throws if no session is present, which triggers UI error handling.
 */
async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Supabase auth error:", error.message);
    throw new Error("Erro ao obter sessão do usuário.");
  }
  if (!user) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }
  return user;
}

/**
 * Build a base query that always filters by the logged‑in user.
 */
function userQuery(userId: string) {
  return supabase.from<Task>(TABLE_NAME).select("*").eq("user_id", userId);
}

/* -------------------------------------------------------------------------- */
/* READ --------------------------------------------------------------------- */
export const taskService = {
  /** Fetch active (non‑deleted) tasks for the current user */
  async getActive(): Promise<Task[]> {
    const user = await getCurrentUser();

    const { data, error } = await userQuery(user.id)
      .is("deleted_at", null) // not soft‑deleted
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getActive error:", error.message);
      throw new Error("Falha ao carregar tarefas ativas.");
    }
    return data || [];
  },

  /** Fetch soft‑deleted tasks (trash) for the current user */
  async getDeleted(): Promise<Task[]> {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from<Task>(TABLE_NAME)
      .select("*")
      .eq("user_id", user.id)
      .not("deleted_at", "is", null) // only rows with a deleted_at timestamp
      .order("deleted_at", { ascending: false });

    if (error) {
      console.error("getDeleted error:", error.message);
      throw new Error("Falha ao carregar tarefas da lixeira.");
    }
    return data || [];
  },

  /* ---------------------------------------------------------------------- */
  /* CREATE ----------------------------------------------------------------- */
  /** Insert a new task – the service automatically adds `user_id` */
  async create(
    task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id" | "deleted_at">,
  ): Promise<Task> {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from<Task>(TABLE_NAME)
      .insert({ ...task, user_id: user.id })
      .single();

    if (error) {
      console.error("create error:", error.message);
      throw new Error("Falha ao criar tarefa.");
    }
    return data!;
  },

  /* ---------------------------------------------------------------------- */
  /* UPDATE ----------------------------------------------------------------- */
  /** Update any mutable fields of a task (title, description, completed, etc.) */
  async update(
    id: string,
    updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>,
  ): Promise<Task> {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from<Task>(TABLE_NAME)
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id) // RLS guard
      .single();

    if (error) {
      console.error("update error:", error.message);
      throw new Error("Falha ao atualizar tarefa.");
    }
    return data!;
  },

  /* ---------------------------------------------------------------------- */
  /* SOFT DELETE ------------------------------------------------------------ */
  /** Move a task to the trash (set deleted_at) */
  async softDelete(id: string): Promise<void> {
    const user = await getCurrentUser();

    const { error } = await supabase
      .from<Task>(TABLE_NAME)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("softDelete error:", error.message);
      throw new Error("Falha ao mover tarefa para a lixeira.");
    }
  },

  /* ---------------------------------------------------------------------- */
  /* RESTORE ---------------------------------------------------------------- */
  /** Restore a soft‑deleted task (clear deleted_at) */
  async restore(id: string): Promise<void> {
    const user = await getCurrentUser();

    const { error } = await supabase
      .from<Task>(TABLE_NAME)
      .update({ deleted_at: null })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("restore error:", error.message);
      throw new Error("Falha ao restaurar tarefa.");
    }
  },

  /* ---------------------------------------------------------------------- */
  /* PERMANENT DELETE ------------------------------------------------------- */
  /** Hard‑delete a task from the database */
  async deletePermanently(id: string): Promise<void> {
    const user = await getCurrentUser();

    const { error } = await supabase
      .from<Task>(TABLE_NAME)
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("deletePermanently error:", error.message);
      throw new Error("Falha ao excluir tarefa permanentemente.");
    }
  },
};