'use client';

import { useState, useMemo } from 'react';
import { Task, StatusFilter, CreateTaskForm, SidebarTab } from '@/types/task';
import { mockTasks, generateId } from '@/lib/task-utils';
import { SidebarNav } from '@/components/sidebar-nav';
import { TaskCard } from '@/components/task-card';
import { TaskFilters } from '@/components/task-filters';
import { ManualCreateForm } from '@/components/manual-create-form';
import { NaturalLanguageCreate } from '@/components/natural-language-create';
import { TaskDetailSheet } from '@/components/task-detail-sheet';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type CreateMode = 'manual' | 'natural-language';

export default function TaskListPage() {
  // 当前Tab
  const [activeTab, setActiveTab] = useState<SidebarTab>('list');
  
  // 创建模式
  const [createMode, setCreateMode] = useState<CreateMode>('manual');
  
  // 任务列表状态
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('全部');
  
  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 详情抽屉状态
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
    setActiveTab('list'); // 创建后跳转到列表
  };

  // 批量新建任务（自然语言创建）
  const handleBatchCreateTasks = (newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
    toast.success(`成功创建 ${newTasks.length} 个任务`);
    setActiveTab('list'); // 创建后跳转到列表
  };

  // 查看任务详情
  const handleViewDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailSheetOpen(true);
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* 左侧导航 */}
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'list' ? (
          <>
            {/* 任务列表页面 */}
            <main className="flex-1 overflow-auto">
              <div className="max-w-6xl mx-auto px-8 py-8">
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
              </div>
            </main>
          </>
        ) : (
          <>
            {/* 新建任务页面 */}
            <main className="flex-1 overflow-auto">
              <div className="max-w-3xl mx-auto px-8 py-8">
                {/* 模式切换Tab */}
                <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg mb-6">
                  <button
                    onClick={() => setCreateMode('manual')}
                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium transition-all duration-150 ${
                      createMode === 'manual'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    手工创建
                  </button>
                  <button
                    onClick={() => setCreateMode('natural-language')}
                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium transition-all duration-150 ${
                      createMode === 'natural-language'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    自然语言创建
                  </button>
                </div>

                {/* 创建表单 */}
                <div className="bg-white rounded-lg border border-zinc-200 p-6">
                  {createMode === 'manual' ? (
                    <ManualCreateForm
                      onSubmit={handleCreateTask}
                      onCancel={() => setActiveTab('list')}
                    />
                  ) : (
                    <NaturalLanguageCreate
                      onSubmit={handleBatchCreateTasks}
                      onCancel={() => setActiveTab('list')}
                    />
                  )}
                </div>
              </div>
            </main>
          </>
        )}
      </div>

      {/* 任务详情抽屉 */}
      <TaskDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        task={selectedTask}
      />
    </div>
  );
}
