'use client';

import { useState, useMemo } from 'react';
import { Check, X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ModelVersion,
  AVAILABLE_MODELS,
  MODEL_STATUS_LABELS,
} from '@/types/task';
import { cn } from '@/lib/utils';

interface ModelVersionSelectorProps {
  value: ModelVersion[];
  onChange: (models: ModelVersion[]) => void;
}

export function ModelVersionSelector({
  value,
  onChange,
}: ModelVersionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤后的模型列表
  const filteredModels = useMemo(() => {
    if (!searchQuery) return AVAILABLE_MODELS;
    const query = searchQuery.toLowerCase();
    return AVAILABLE_MODELS.filter(
      (model) =>
        model.name.toLowerCase().includes(query) ||
        model.version.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 按模型名称分组
  const groupedModels = useMemo(() => {
    const groups: Record<string, ModelVersion[]> = {};
    filteredModels.forEach((model) => {
      if (!groups[model.name]) {
        groups[model.name] = [];
      }
      groups[model.name].push(model);
    });
    return groups;
  }, [filteredModels]);

  // 切换模型选中状态
  const toggleModel = (model: ModelVersion) => {
    const isSelected = value.some((m) => m.id === model.id);
    if (isSelected) {
      onChange(value.filter((m) => m.id !== model.id));
    } else {
      onChange([...value, model]);
    }
  };

  // 移除已选模型
  const removeModel = (model: ModelVersion) => {
    onChange(value.filter((m) => m.id !== model.id));
  };

  // 清空所有选择
  const clearAll = () => {
    onChange([]);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: ModelVersion['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'beta':
        return 'bg-blue-100 text-blue-700';
      case 'deprecated':
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      {/* 已选模型标签 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((model) => (
            <Badge
              key={model.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              <span>{model.name}</span>
              <span className="text-muted-foreground">{model.version}</span>
              <button
                type="button"
                onClick={() => removeModel(model)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            清空
          </button>
        </div>
      )}

      {/* 下拉选择器 */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value.length > 0
              ? `已选择 ${value.length} 个模型版本`
              : '选择模型版本（可多选）'}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          {/* 搜索框 */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索模型名称或版本..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* 模型列表 */}
          <div className="max-h-[300px] overflow-y-auto">
            {Object.keys(groupedModels).length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                未找到匹配的模型
              </div>
            ) : (
              Object.entries(groupedModels).map(([modelName, models]) => (
                <div key={modelName}>
                  {/* 模型名称分组标题 */}
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                    {modelName}
                  </div>
                  {/* 该模型的所有版本 */}
                  {models.map((model) => {
                    const isSelected = value.some((m) => m.id === model.id);
                    return (
                      <div
                        key={model.id}
                        onClick={() => toggleModel(model)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50',
                          isSelected && 'bg-muted/30'
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleModel(model)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.version}</span>
                            <Badge
                              variant="secondary"
                              className={cn('text-[10px] px-1.5', getStatusColor(model.status))}
                            >
                              {MODEL_STATUS_LABELS[model.status]}
                            </Badge>
                          </div>
                          {model.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {model.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* 底部操作 */}
          <div className="p-3 border-t flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              共 {AVAILABLE_MODELS.length} 个模型版本
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
              >
                清空
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(AVAILABLE_MODELS.filter(m => m.status !== 'deprecated'))}
              >
                全选可用
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
