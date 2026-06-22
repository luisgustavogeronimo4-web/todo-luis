"import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/Task";

const TABLE_NAME = "tasks";

export const taskService = {
  async getActive(userId: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
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

  async getDeleted(userId: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", true);
    if (error) {
      console.error("getDeleted error:", error.message);
      return [];
    }
    return data || [];
  },

  async create(task: Omit<Task, "id" | "created_at" | "updated_at">, userId: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({ ...task, user_id: userId })
      .single();
    if (error) {
      console.error("create error:", error.message);
      return null;
    }
    return data;
  },

  async update(taskId: string, updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq("id", taskId)
      .single();
    if (error) {
      console.error("update error:", error.message);
      return null;
    }
    return data;
  },

  async delete(taskId: string) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ is_deleted: true })
      .eq("id", taskId);
    if (error) {
      console.error("delete error:", error.message);
      return false;
    }
    return true;
  },

  async restore(taskId: string) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ is_deleted: false })
      .eq("id", taskId);
    if (error) {
      console.error("restore error:", error.message);
      return false;
    }
    return true;
  },

  async deletePermanently(taskId: string) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", taskId);
    if (error) {
      console.error("deletePermanently error:", error.message);
      return false;
    }
    return true;
  },
};