import { Task, TaskStatus, TaskPriority } from '@/types/task';

// 状态颜色映射
export const statusColorMap: Record<TaskStatus, string> = {
  '待执行': 'bg-zinc-100 text-zinc-600',
  '执行中': 'bg-blue-100 text-blue-700',
  '已完成': 'bg-green-100 text-green-700',
  '已失败': 'bg-red-100 text-red-700',
  '已取消': 'bg-yellow-100 text-yellow-700',
};

// 优先级颜色映射
export const priorityColorMap: Record<TaskPriority, string> = {
  '高': 'text-red-600',
  '中': 'text-yellow-600',
  '低': 'text-green-600',
};

// 生成唯一ID
export function generateId(): string {
  return `TASK-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// 格式化日期
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 模拟初始任务数据
export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    name: 'GPT-4o 多轮对话能力评测',
    type: '大模型评测',
    creator: '张三',
    createdAt: new Date('2024-01-15 10:30:00'),
    status: '已完成',
    priority: '高',
    description: '评测GPT-4o在多轮对话场景下的上下文理解能力和逻辑一致性',
  },
  {
    id: 'TASK-002',
    name: '图像生成模型质量对比',
    type: '图像评测',
    creator: '李四',
    createdAt: new Date('2024-01-14 15:20:00'),
    status: '执行中',
    priority: '中',
    description: '对比DALL-E 3和Midjourney v6在多种场景下的图像生成质量',
  },
  {
    id: 'TASK-003',
    name: '语音识别准确率测试',
    type: '语音评测',
    creator: '王五',
    createdAt: new Date('2024-01-14 09:00:00'),
    status: '待执行',
    priority: '低',
    description: '测试多语言语音识别系统在不同口音下的准确率',
  },
  {
    id: 'TASK-004',
    name: '视频内容理解能力评估',
    type: '视频评测',
    creator: '赵六',
    createdAt: new Date('2024-01-13 14:45:00'),
    status: '已失败',
    priority: '高',
    description: '评估视频理解模型在复杂场景下的内容识别能力',
  },
  {
    id: 'TASK-005',
    name: '文生图模型安全性测试',
    type: '图像评测',
    creator: '张三',
    createdAt: new Date('2024-01-12 11:00:00'),
    status: '已完成',
    priority: '高',
    description: '测试文生图模型对有害提示词的过滤能力',
  },
  {
    id: 'TASK-006',
    name: '大模型数学推理能力评测',
    type: '大模型评测',
    creator: '李四',
    createdAt: new Date('2024-01-11 16:30:00'),
    status: '已取消',
    priority: '中',
    description: '评测大模型在复杂数学问题上的推理准确率',
  },
];
