import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/Task";

export const taskService = {
  async getActive(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getActive error:", error.message);
      return [];
    }

    return data || [];
  },

  async getDeleted(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getDeleted error:", error.message);
      return [];
    }

    return data || [];
  },

  async create(
    task: Omit<Task, "id" | "created_at" | "updated_at">,
    userId: string
  ): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...task,
        user_id: userId,
        is_deleted: false,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("create error:", error.message);
      return null;
    }

    return data;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("update error:", error.message);
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("tasks")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("delete error:", error.message);
      return false;
    }

    return true;
  },

  async restore(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("tasks")
      .update({
        is_deleted: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("restore error:", error.message);
      return false;
    }

    return true;
  },

  async deletePermanently(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deletePermanently error:", error.message);
      return false;
    }

    return true;
  },
};