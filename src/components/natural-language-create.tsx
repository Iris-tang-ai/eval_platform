'use client';

import { useState, useCallback } from 'react';
import { Task, TaskType, TaskPriority } from '@/types/task';
import { generateId } from '@/lib/task-utils';
import { TaskPreviewCard } from './task-preview-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface NaturalLanguageCreateProps {
  onSubmit: (tasks: Task[]) => void;
  onCancel: () => void;
}

// 模拟AI拆解结果（实际项目中应调用后端API）
async function parseNaturalLanguage(input: string): Promise<Partial<Task>[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 简单的关键词匹配拆解逻辑（实际应使用LLM）
  const tasks: Partial<Task>[] = [];
  
  // 检测任务类型关键词
  const typeKeywords: Record<TaskType, string[]> = {
    '大模型评测': ['大模型', 'LLM', 'GPT', '对话', '推理', '代码生成', '文本生成'],
    '图像评测': ['图像', '图片', '视觉', '绘图', '文生图', 'DALL-E', 'Midjourney'],
    '语音评测': ['语音', '音频', 'ASR', 'TTS', '语音识别', '语音合成'],
    '视频评测': ['视频', '视频理解', '视频生成'],
  };

  // 检测优先级关键词
  const priorityKeywords: Record<TaskPriority, string[]> = {
    '高': ['高优先级', '紧急', '重要', '尽快'],
    '中': ['中优先级', '一般'],
    '低': ['低优先级', '不急'],
  };

  // 按句子或项目符号拆分
  const lines = input.split(/[。\n；;]/).filter((line) => line.trim());
  
  // 如果没有明显的分隔，尝试提取关键词生成任务
  if (lines.length <= 1) {
    // 检测模型名称
    const modelMatch = input.match(/(GPT-\d+[o]?)|(Claude)|(Gemini)|(通义)|(文心)/i);
    const modelName = modelMatch ? modelMatch[0] : '模型';

    // 检测能力关键词
    const capabilities = ['对话', '推理', '代码', '生成', '理解', '翻译', '摘要'];
    const detectedCapabilities = capabilities.filter((cap) => input.includes(cap));

    if (detectedCapabilities.length > 0) {
      detectedCapabilities.forEach((cap) => {
        // 推断任务类型
        let taskType: TaskType = '大模型评测';
        for (const [type, keywords] of Object.entries(typeKeywords)) {
          if (keywords.some((kw) => cap.includes(kw) || input.includes(kw))) {
            taskType = type as TaskType;
            break;
          }
        }

        // 推断优先级
        let priority: TaskPriority = '中';
        for (const [p, keywords] of Object.entries(priorityKeywords)) {
          if (keywords.some((kw) => input.includes(kw))) {
            priority = p as TaskPriority;
            break;
          }
        }

        tasks.push({
          name: `${modelName}${cap}能力评测`,
          type: taskType,
          priority,
          description: `评测${modelName}在${cap}场景下的表现能力`,
        });
      });
    } else {
      // 默认生成一个通用任务
      tasks.push({
        name: `${modelName}综合能力评测`,
        type: '大模型评测',
        priority: '中',
        description: input.slice(0, 200),
      });
    }
  } else {
    // 按行拆分生成任务
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.length < 3) return; // 忽略太短的内容

      // 推断任务类型
      let taskType: TaskType = '大模型评测';
      for (const [type, keywords] of Object.entries(typeKeywords)) {
        if (keywords.some((kw) => trimmed.includes(kw) || input.includes(kw))) {
          taskType = type as TaskType;
          break;
        }
      }

      // 推断优先级
      let priority: TaskPriority = '中';
      for (const [p, keywords] of Object.entries(priorityKeywords)) {
        if (keywords.some((kw) => input.includes(kw))) {
          priority = p as TaskPriority;
          break;
        }
      }

      tasks.push({
        name: trimmed.length > 50 ? trimmed.slice(0, 50) + '...' : trimmed,
        type: taskType,
        priority,
        description: trimmed,
      });
    });
  }

  return tasks.length > 0 ? tasks : [{ name: '新建评测任务', type: '大模型评测', priority: '中', description: input }];
}

export function NaturalLanguageCreate({ onSubmit, onCancel }: NaturalLanguageCreateProps) {
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [previewTasks, setPreviewTasks] = useState<Task[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

  // 执行拆解
  const handleParse = useCallback(async () => {
    if (!input.trim()) {
      setError('请输入评测需求描述');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const parsedTasks = await parseNaturalLanguage(input);
      
      // 转换为完整Task对象
      const tasks: Task[] = parsedTasks.map((partial) => ({
        id: generateId(),
        name: partial.name || '未命名任务',
        type: partial.type || '大模型评测',
        creator: '当前用户',
        createdAt: new Date(),
        status: '待执行' as const,
        priority: partial.priority || '中',
        description: partial.description,
      }));

      setPreviewTasks(tasks);
      setShowPreview(true);
    } catch (err) {
      setError('拆解失败，请重试或使用手工创建');
    } finally {
      setIsParsing(false);
    }
  }, [input]);

  // 更新预览任务
  const handleUpdateTask = useCallback((index: number, task: Task) => {
    setPreviewTasks((prev) => prev.map((t, i) => (i === index ? task : t)));
  }, []);

  // 删除预览任务
  const handleDeleteTask = useCallback((index: number) => {
    setPreviewTasks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 添加新任务
  const handleAddTask = useCallback(() => {
    setPreviewTasks((prev) => [
      ...prev,
      {
        id: generateId(),
        name: '',
        type: '大模型评测',
        creator: '当前用户',
        createdAt: new Date(),
        status: '待执行',
        priority: '中',
        description: '',
      },
    ]);
  }, []);

  // 确认创建
  const handleConfirm = useCallback(() => {
    // 过滤掉空任务
    const validTasks = previewTasks.filter((task) => task.name.trim());
    if (validTasks.length === 0) {
      setError('请至少创建一个有效任务');
      return;
    }
    onSubmit(validTasks);
  }, [previewTasks, onSubmit]);

  // 重新拆解
  const handleReset = useCallback(() => {
    setShowPreview(false);
    setPreviewTasks([]);
    setError(null);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6 space-y-4 overflow-auto">
        {!showPreview ? (
          <>
            {/* 输入区域 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">评测需求描述</Label>
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                placeholder="请输入您的评测需求描述，例如：评测GPT-4o的多轮对话能力、逻辑推理能力和代码生成能力..."
                rows={8}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                {error && <p className="text-xs text-red-500">{error}</p>}
                <p className="text-xs text-zinc-400 ml-auto">
                  {input.length}/2000
                </p>
              </div>
            </div>

            {/* 示例区域 */}
            <div className="space-y-2">
              <button
                onClick={() => setShowExample(!showExample)}
                className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showExample ? 'rotate-90' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                示例
              </button>
              {showExample && (
                <div className="p-3 bg-zinc-50 rounded-lg text-sm text-zinc-600">
                  <p className="mb-2 font-medium">示例输入：</p>
                  <pre className="whitespace-pre-wrap text-xs bg-white p-3 rounded border">
{`需要评测GPT-4o模型的以下能力：
1. 多轮对话的上下文理解
2. 复杂数学问题的推理能力
3. Python代码生成和debug能力
优先级：高优先级`}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 拆解结果预览 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  拆解结果（{previewTasks.length} 个任务）
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 text-xs"
                >
                  重新拆解
                </Button>
              </div>

              {previewTasks.map((task, index) => (
                <TaskPreviewCard
                  key={task.id}
                  task={task}
                  index={index}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}

              {/* 添加任务按钮 */}
              <Button
                variant="outline"
                onClick={handleAddTask}
                className="w-full h-10 border-dashed"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                添加任务
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          取消
        </Button>
        {!showPreview ? (
          <Button
            onClick={handleParse}
            disabled={isParsing || !input.trim()}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800"
          >
            {isParsing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                拆解中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                智能拆解
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleConfirm} className="flex-1 bg-zinc-900 hover:bg-zinc-800">
            确认创建
          </Button>
        )}
      </div>
    </div>
  );
}
