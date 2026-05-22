'use client';

import { Task } from '@/types/task';
import { statusColorMap, priorityColorMap, formatDate } from '@/lib/task-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface TaskCardProps {
  task: Task;
  onViewDetail: (task: Task) => void;
}

export function TaskCard({ task, onViewDetail }: TaskCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-150">
      {/* 头部：任务名称 + 状态标签 */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 flex-1">
          {task.name}
        </h3>
        <Badge className={`${statusColorMap[task.status]} shrink-0 text-xs font-medium`}>
          {task.status}
        </Badge>
      </div>

      {/* 主体：任务信息 */}
      <div className="space-y-2 text-sm text-zinc-600 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 w-14">类型：</span>
          <span>{task.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 w-14">创建人：</span>
          <span>{task.creator}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 w-14">时间：</span>
          <span>{formatDate(task.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 w-14">优先级：</span>
          <span className={`font-medium ${priorityColorMap[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* 底部：操作按钮 */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(task)}
          className="h-8 px-3 text-xs"
        >
          查看详情
        </Button>
      </div>
    </Card>
  );
}
