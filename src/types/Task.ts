export type Task = {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  is_deleted: boolean;
  is_completed: boolean;
  user_id: string;
  due_date?: string; // New field
  priority?: "low" | "medium" | "high"; // New field
};