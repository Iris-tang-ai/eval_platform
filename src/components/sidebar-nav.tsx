'use client';

import { SidebarTab } from '@/types/task';

interface SidebarNavProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <nav className="w-[200px] bg-white border-r border-zinc-200 flex flex-col">
      {/* Logo区域 */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-zinc-200">
        <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-sm font-semibold text-zinc-900">评测任务管理</h1>
      </div>

      {/* Tab列表 */}
      <div className="flex-1 p-3 space-y-1">
        <button
          onClick={() => onTabChange('list')}
          className={`w-full flex items-center gap-2 h-12 px-4 rounded-lg text-sm font-medium transition-colors duration-150 ${
            activeTab === 'list'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          任务列表
        </button>

        <button
          onClick={() => onTabChange('create')}
          className={`w-full flex items-center gap-2 h-12 px-4 rounded-lg text-sm font-medium transition-colors duration-150 ${
            activeTab === 'create'
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          新建任务
        </button>
      </div>
    </nav>
  );
}
