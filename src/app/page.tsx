'use client';

import { useState, useMemo } from 'react';
import { Task, StatusFilter, CreateTaskForm } from '@/types/task';
import { mockTasks, generateId } from '@/lib/task-utils';
import { TaskCard } from '@/components/task-card';
import { TaskFilters } from '@/components/task-filters';
import { CreateTaskSheet } from '@/components/create-task-sheet';
import { TaskDetailSheet } from '@/components/task-detail-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function TaskListPage() {
  // 任务列表状态
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('全部');
  
  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 抽屉状态
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 过滤后的任务列表
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 按状态筛选
    if (statusFilter !== '全部') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // 按关键词搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      result = result.filter((task) =>
        task.name.toLowerCase().includes(keyword)
      );
    }

    // 按创建时间倒序排列
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return result;
  }, [tasks, statusFilter, searchKeyword]);

  // 新建任务
  const handleCreateTask = (formData: CreateTaskForm) => {
    const newTask: Task = {
      id: generateId(),
      name: formData.name,
      type: formData.type,
      creator: '当前用户',
      createdAt: new Date(),
      status: '待执行',
      priority: formData.priority,
      description: formData.description,
    };

    setTasks((prev) => [newTask, ...prev]);
    toast.success('任务创建成功');
  };

  // 批量新建任务（自然语言创建）
  const handleBatchCreateTasks = (newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
    toast.success(`成功创建 ${newTasks.length} 个任务`);
  };

  // 查看任务详情
  const handleViewDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">评测任务管理系统</h1>
        </div>
        <Button
          onClick={() => setCreateSheetOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 h-9 px-4 text-sm"
        >
          新建任务
        </Button>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 工具栏区域 */}
        <div className="mb-6 space-y-4">
          {/* 搜索框 */}
          <div className="max-w-md">
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索任务名称..."
              className="h-10 bg-white"
            />
          </div>

          {/* 状态筛选 */}
          <TaskFilters
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>

        {/* 任务列表 */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <svg className="w-16 h-16 mb-4 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">暂无任务数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        )}
      </main>

      {/* 新建任务抽屉 */}
      <CreateTaskSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        onSubmit={handleCreateTask}
        onBatchSubmit={handleBatchCreateTasks}
      />

      {/* 任务详情抽屉 */}
      <TaskDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        task={selectedTask}
      />
    </div>
  );
}
