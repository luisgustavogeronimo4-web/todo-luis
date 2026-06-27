import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { Star } from "lucide-react";

interface TaskFiltersProps {
  sortBy: "created" | "due" | "priority";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "created" | "due" | "priority", sortOrder: "asc" | "desc") => void;
  filterBy: "all" | "completed" | "pending";
  onFilterChange: (filter: "all" | "completed" | "pending") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TaskFilters = ({
  sortBy,
  sortOrder,
  onSortChange,
  filterBy,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: TaskFiltersProps) => {
  return (
    <div className="relative flex flex-col sm:flex-row gap-3 p-4 bg-zinc-900 border-4 border-red-600 -rotate-1 shadow-[4px_4px_0px_0px_rgba(211,18,18,1)]">
      {/* Star accents */}
      <div className="absolute top-2 left-2 opacity-10 pointer-events-none">
        <Star className="h-4 w-4 text-red-600" />
      </div>
      <div className="absolute bottom-2 right-2 opacity-10 pointer-events-none">
        <Star className="h-4 w-4 text-white" />
      </div>
      
      <div className="relative z-10 flex items-center gap-2 rotate-1">
        <Filter className="h-4 w-4 text-red-600" />
        <Select value={filterBy} onValueChange={(v) => onFilterChange(v as any)}>
          <SelectTrigger className="w-40 bg-zinc-800 border-2 border-red-600 text-white -rotate-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-red-600">
            <SelectItem value="all" className="text-white">All Tasks</SelectItem>
            <SelectItem value="pending" className="text-white">Pending</SelectItem>
            <SelectItem value="completed" className="text-white">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative z-10 flex items-center gap-2 rotate-1">
        {sortOrder === "asc" ? (
          <SortAsc className="h-4 w-4 text-red-600" />
        ) : (
          <SortDesc className="h-4 w-4 text-red-600" />
        )}
        <Select 
          value={`${sortBy}-${sortOrder}`} 
          onValueChange={(v) => {
            const [newSortBy, newSortOrder] = v.split("-") as [any, any];
            onSortChange(newSortBy, newSortOrder);
          }}
        >
          <SelectTrigger className="w-48 bg-zinc-800 border-2 border-red-600 text-white -rotate-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-red-600">
            <SelectItem value="created-asc" className="text-white">Created (Oldest)</SelectItem>
            <SelectItem value="created-desc" className="text-white">Created (Newest)</SelectItem>
            <SelectItem value="due-asc" className="text-white">Due Date (Soonest)</SelectItem>
            <SelectItem value="due-desc" className="text-white">Due Date (Latest)</SelectItem>
            <SelectItem value="priority-asc" className="text-white">Priority (Low-High)</SelectItem>
            <SelectItem value="priority-desc" className="text-white">Priority (High-Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Add search input */}
      <div className="relative z-10 flex items-center gap-2 rotate-1">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-48 bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0 -rotate-1"
        />
      </div>
    </div>
  );
};