'use client';

import { StatusFilter, STATUS_FILTER_OPTIONS } from '@/types/task';

interface TaskFiltersProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-1">
      {STATUS_FILTER_OPTIONS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
            currentFilter === filter
              ? 'bg-zinc-900 text-white'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
