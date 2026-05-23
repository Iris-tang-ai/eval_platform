'use client';

import { useState } from 'react';
import { CreateTaskForm, TaskType, TaskPriority, Dataset, ModelVersion, TASK_TYPE_OPTIONS, PRIORITY_OPTIONS } from '@/types/task';
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
import { DatasetSelector } from '@/components/dataset-selector';
import { ModelVersionSelector } from '@/components/model-version-selector';

interface ManualCreateFormProps {
  onSubmit: (task: CreateTaskForm) => void;
  onCancel: () => void;
}

export function ManualCreateForm({ onSubmit, onCancel }: ManualCreateFormProps) {
  const [formData, setFormData] = useState<CreateTaskForm>({
    name: '',
    type: '大模型评测',
    priority: '中',
    description: '',
    dataset: undefined,
    models: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskForm, string>>>({});

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
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6 py-6">
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

        {/* 数据集 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            数据集
          </Label>
          <DatasetSelector
            value={formData.dataset}
            onChange={(dataset: Dataset | undefined) => 
              setFormData({ ...formData, dataset })
            }
          />
        </div>

        {/* 模型版本 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            模型版本
          </Label>
          <ModelVersionSelector
            value={formData.models || []}
            onChange={(models: ModelVersion[]) => 
              setFormData({ ...formData, models })
            }
          />
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

      {/* 底部按钮 */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          取消
        </Button>
        <Button onClick={handleSubmit} className="flex-1 bg-zinc-900 hover:bg-zinc-800">
          创建
        </Button>
      </div>
    </div>
  );
}
