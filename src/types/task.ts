// 任务类型枚举
export type TaskType = 
  | '大模型评测'
  | '图像评测'
  | '语音评测'
  | '视频评测';

// 任务状态枚举
export type TaskStatus = 
  | '待执行'
  | '执行中'
  | '已完成'
  | '已失败'
  | '已取消';

// 任务优先级枚举
export type TaskPriority = '高' | '中' | '低';

// 数据集上传方式
export type DatasetUploadType = 'local' | 'cloud';

// 本地上传的数据集
export interface LocalDataset {
  type: 'local';
  file: File;
  name: string;
  size: number;
}

// 云端数据集
export interface CloudDataset {
  type: 'cloud';
  id: string;
  name: string;
  size: number;
  createdAt: Date;
}

// 数据集类型（联合类型）
export type Dataset = LocalDataset | CloudDataset;

// 任务数据类型
export interface Task {
  id: string;
  name: string;
  type: TaskType;
  creator: string;
  createdAt: Date;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string;
  dataset?: Dataset;
}

// 新建任务表单数据
export interface CreateTaskForm {
  name: string;
  type: TaskType;
  priority: TaskPriority;
  description?: string;
  dataset?: Dataset;
}

// 状态筛选选项
export type StatusFilter = TaskStatus | '全部';

// 任务类型选项
export const TASK_TYPE_OPTIONS: TaskType[] = [
  '大模型评测',
  '图像评测',
  '语音评测',
  '视频评测',
];

// 优先级选项
export const PRIORITY_OPTIONS: TaskPriority[] = ['高', '中', '低'];

// 状态选项（用于筛选）
export const STATUS_FILTER_OPTIONS: StatusFilter[] = [
  '全部',
  '待执行',
  '执行中',
  '已完成',
  '已失败',
];

// 侧边栏Tab类型
export type SidebarTab = 'list' | 'manual' | 'natural-language';
