'use client';

import { useState } from 'react';
import { CreateTaskForm, TaskType, TaskPriority, TASK_TYPE_OPTIONS, PRIORITY_OPTIONS } from '@/types/task';
import { generateId } from '@/lib/task-utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
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

interface CreateTaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: CreateTaskForm) => void;
}

export function CreateTaskSheet({ open, onOpenChange, onSubmit }: CreateTaskSheetProps) {
  const [formData, setFormData] = useState<CreateTaskForm>({
    name: '',
    type: '大模型评测',
    priority: '中',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskForm, string>>>({});

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      type: '大模型评测',
      priority: '中',
      description: '',
    });
    setErrors({});
  };

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTaskForm, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入任务名称';
    } else if (formData.name.length > 100) {
      newErrors.name = '任务名称不能超过100个字符';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = '描述不能超过500个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
      onOpenChange(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">新建任务</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* 任务名称 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              任务名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入任务名称"
              className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* 任务类型 */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              任务类型 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as TaskType })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="请选择任务类型" />
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

          {/* 优先级 */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              优先级 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="请选择优先级" />
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

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              描述
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入任务描述（选填）"
              rows={4}
              className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between items-center">
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-zinc-400 ml-auto">
                {formData.description?.length || 0}/500
              </p>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSubmit} className="bg-zinc-900 hover:bg-zinc-800">
            创建
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
