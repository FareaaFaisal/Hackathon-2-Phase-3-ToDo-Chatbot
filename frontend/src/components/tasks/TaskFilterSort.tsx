// frontend/src/components/tasks/TaskFilterSort.tsx
'use client';

import React from 'react';
import Input from '../common/Input'; // Assuming Input can be used for select/dropdown if needed, or a custom select.

type FilterStatus = 'all' | 'pending' | 'completed';
type SortBy = 'title' | 'created_date';
type SortOrder = 'asc' | 'desc';

interface TaskFilterSortProps {
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  currentSortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  currentSortOrder: SortOrder;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

const TaskFilterSort: React.FC<TaskFilterSortProps> = ({
  currentFilter,
  onFilterChange,
  currentSortBy,
  onSortByChange,
  currentSortOrder,
  onSortOrderChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6 space-y-3 sm:space-y-0 sm:space-x-4">
      {/* Filter by Status */}
      <div className="flex items-center space-x-2">
        <label htmlFor="filterStatus" className="text-gray-700 text-sm font-medium">Filter:</label>
        <select
          id="filterStatus"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sortBy" className="text-gray-700 text-sm font-medium">Sort By:</label>
        <select
          id="sortBy"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          value={currentSortBy}
          onChange={(e) => onSortByChange(e.target.value as SortBy)}
        >
          <option value="created_date">Created Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sortOrder" className="text-gray-700 text-sm font-medium">Order:</label>
        <select
          id="sortOrder"
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          value={currentSortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilterSort;
