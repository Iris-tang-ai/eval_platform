'use client';

import { useState, useEffect } from 'react';
import { SidebarTab } from '@/types/task';

interface SidebarNavProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  // 新建任务是否展开
  const [createExpanded, setCreateExpanded] = useState(false);

  // 当选中子Tab时，自动展开
  useEffect(() => {
    if (activeTab === 'manual' || activeTab === 'natural-language') {
      setCreateExpanded(true);
    }
  }, [activeTab]);

  // 点击新建任务主Tab
  const handleCreateClick = () => {
    if (!createExpanded) {
      setCreateExpanded(true);
      onTabChange('manual'); // 默认选中手工创建
    } else {
      setCreateExpanded(false);
    }
  };

  // 判断是否是新建任务下的子Tab被选中
  const isCreateTabActive = activeTab === 'manual' || activeTab === 'natural-language';

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
        {/* 任务列表 */}
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

        {/* 新建任务（可展开） */}
        <div className="space-y-1">
          <button
            onClick={handleCreateClick}
            className={`w-full flex items-center justify-between h-12 px-4 rounded-lg text-sm font-medium transition-colors duration-150 ${
              isCreateTabActive
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              新建任务
            </div>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${createExpanded ? 'rotate-90' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* 子Tab */}
          {createExpanded && (
            <div className="ml-4 space-y-1">
              <button
                onClick={() => onTabChange('manual')}
                className={`w-full flex items-center gap-2 h-10 px-3 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                  activeTab === 'manual'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                手工创建
              </button>

              <button
                onClick={() => onTabChange('natural-language')}
                className={`w-full flex items-center gap-2 h-10 px-3 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                  activeTab === 'natural-language'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                自然语言创建
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
