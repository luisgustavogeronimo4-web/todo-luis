"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SortAsc, SortDesc } from "lucide-react";

interface TaskFiltersProps {
  sortBy: "created" | "due" | "priority";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "created" | "due" | "priority", sortOrder: "asc" | "desc") => void;
  filterBy: "all" | "completed" | "pending";
  onFilterChange: (filter: "all" | "completed" | "pending") => void;
}

export const TaskFilters = ({
  sortBy,
  sortOrder,
  onSortChange,
  filterBy,
  onFilterChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-800 rounded-lg">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-zinc-400" />
        <Select value={filterBy} onValueChange={(v) => onFilterChange(v as any)}>
          <SelectTrigger className="w-40 bg-zinc-700 border-zinc-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        {sortOrder === "asc" ? (
          <SortAsc className="h-4 w-4 text-zinc-400" />
        ) : (
          <SortDesc className="h-4 w-4 text-zinc-400" />
        )}
        <Select 
          value={`${sortBy}-${sortOrder}`} 
          onValueChange={(v) => {
            const [newSortBy, newSortOrder] = v.split("-") as [any, any];
            onSortChange(newSortBy, newSortOrder);
          }}
        >
          <SelectTrigger className="w-48 bg-zinc-700 border-zinc-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created-asc">Created (Oldest)</SelectItem>
            <SelectItem value="created-desc">Created (Newest)</SelectItem>
            <SelectItem value="due-asc">Due Date (Soonest)</SelectItem>
            <SelectItem value="due-desc">Due Date (Latest)</SelectItem>
            <SelectItem value="priority-asc">Priority (Low-High)</SelectItem>
            <SelectItem value="priority-desc">Priority (High-Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};