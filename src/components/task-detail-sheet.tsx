'use client';

import { Task } from '@/types/task';
import { statusColorMap, priorityColorMap, formatDate } from '@/lib/task-utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TaskDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function TaskDetailSheet({ open, onOpenChange, task }: TaskDetailSheetProps) {
  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <div className="flex items-start justify-between gap-2 pr-8">
            <SheetTitle className="text-lg font-semibold line-clamp-2">
              {task.name}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* 状态 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-500">状态</h4>
            <Badge className={`${statusColorMap[task.status]} text-xs font-medium`}>
              {task.status}
            </Badge>
          </div>

          <Separator />

          {/* 基本信息 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-500">基本信息</h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">任务ID</span>
                <span className="text-zinc-900 font-mono">{task.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">任务类型</span>
                <span className="text-zinc-900">{task.type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">创建人</span>
                <span className="text-zinc-900">{task.creator}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">创建时间</span>
                <span className="text-zinc-900">{formatDate(task.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">优先级</span>
                <span className={`font-medium ${priorityColorMap[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>

          {/* 描述 */}
          {task.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-zinc-500">任务描述</h4>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  {task.description}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
