'use client';

import { Task, TaskType, TaskPriority, TASK_TYPE_OPTIONS, PRIORITY_OPTIONS } from '@/types/task';
import { priorityColorMap } from '@/lib/task-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface TaskPreviewCardProps {
  task: Task;
  index: number;
  onUpdate: (index: number, task: Task) => void;
  onDelete: (index: number) => void;
}

export function TaskPreviewCard({ task, index, onUpdate, onDelete }: TaskPreviewCardProps) {
  return (
    <div className="p-4 border border-zinc-200 rounded-lg bg-white space-y-3">
      {/* 头部：序号 + 删除按钮 */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">任务 {index + 1}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(index)}
          className="h-6 px-2 text-zinc-400 hover:text-red-500 hover:bg-red-50"
        >
          删除
        </Button>
      </div>

      {/* 任务名称 */}
      <div className="space-y-1">
        <Label className="text-xs text-zinc-500">任务名称</Label>
        <Input
          value={task.name}
          onChange={(e) => onUpdate(index, { ...task, name: e.target.value })}
          className="h-9 text-sm"
          placeholder="请输入任务名称"
        />
      </div>

      {/* 任务类型和优先级 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-zinc-500">任务类型</Label>
          <Select
            value={task.type}
            onValueChange={(value) => onUpdate(index, { ...task, type: value as TaskType })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-zinc-500">优先级</Label>
          <Select
            value={task.priority}
            onValueChange={(value) => onUpdate(index, { ...task, priority: value as TaskPriority })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 描述 */}
      <div className="space-y-1">
        <Label className="text-xs text-zinc-500">描述</Label>
        <Textarea
          value={task.description || ''}
          onChange={(e) => onUpdate(index, { ...task, description: e.target.value })}
          rows={2}
          className="text-sm resize-none"
          placeholder="请输入任务描述"
        />
      </div>
    </div>
  );
}
