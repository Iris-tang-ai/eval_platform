'use client';

import { useState } from 'react';
import { Task, CreateTaskForm } from '@/types/task';
import { ManualCreateForm } from './manual-create-form';
import { NaturalLanguageCreate } from './natural-language-create';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type CreateMode = 'manual' | 'natural-language';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: CreateTaskForm) => void;
  onBatchSubmit?: (tasks: Task[]) => void;
}

export function CreateTaskDialog({ open, onOpenChange, onSubmit, onBatchSubmit }: CreateTaskDialogProps) {
  const [mode, setMode] = useState<CreateMode>('manual');

  // 关闭时重置模式
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMode('manual');
    }
    onOpenChange(newOpen);
  };

  // 手工创建提交
  const handleManualSubmit = (formData: CreateTaskForm) => {
    onSubmit(formData);
    onOpenChange(false);
  };

  // 自然语言创建提交（批量）
  const handleNaturalLanguageSubmit = (tasks: Task[]) => {
    if (onBatchSubmit) {
      onBatchSubmit(tasks);
    }
    onOpenChange(false);
  };

  // 取消操作
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] p-8 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">新建任务</DialogTitle>
        </DialogHeader>

        {/* 模式切换Tab */}
        <div className="flex gap-1 mt-2 p-1 bg-zinc-100 rounded-lg">
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all duration-150 ${
              mode === 'manual'
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
            onClick={() => setMode('natural-language')}
            className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all duration-150 ${
              mode === 'natural-language'
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

        {/* 内容区域 */}
        <div className="mt-4 h-[calc(90vh-220px)] overflow-hidden">
          {mode === 'manual' ? (
            <ManualCreateForm
              onSubmit={handleManualSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <NaturalLanguageCreate
              onSubmit={handleNaturalLanguageSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
