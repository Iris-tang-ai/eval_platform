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

// 模型版本状态
export type ModelStatus = 'available' | 'beta' | 'deprecated';

// 模型版本
export interface ModelVersion {
  id: string;
  name: string;       // 模型名称，如 GPT-4
  version: string;    // 版本号，如 v1.0
  status: ModelStatus;
  description?: string;
}

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
  models?: ModelVersion[];  // 选中的模型版本
}

// 新建任务表单数据
export interface CreateTaskForm {
  name: string;
  type: TaskType;
  priority: TaskPriority;
  description?: string;
  dataset?: Dataset;
  models?: ModelVersion[];  // 选中的模型版本
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
export type SidebarTab = 'list' | 'manual' | 'natural-language' | 'step-create';

// 模型状态选项
export const MODEL_STATUS_LABELS: Record<ModelStatus, string> = {
  available: '可用',
  beta: '内测',
  deprecated: '已下线',
};

// 模拟的模型版本数据
export const AVAILABLE_MODELS: ModelVersion[] = [
  { id: '1', name: 'GPT-4', version: 'v1.0', status: 'available', description: '最新稳定版本' },
  { id: '2', name: 'GPT-4', version: 'v1.1-preview', status: 'beta', description: '预览版本' },
  { id: '3', name: 'GPT-3.5', version: 'v2.0', status: 'available', description: '稳定版本' },
  { id: '4', name: 'Claude-3', version: 'v1.0', status: 'available', description: 'Opus版本' },
  { id: '5', name: 'Claude-3', version: 'v1.0-sonnet', status: 'available', description: 'Sonnet版本' },
  { id: '6', name: 'Claude-2', version: 'v1.0', status: 'deprecated', description: '旧版本' },
  { id: '7', name: '文心一言', version: 'v4.0', status: 'available', description: 'ERNIE-Bot 4.0' },
  { id: '8', name: '文心一言', version: 'v3.5', status: 'available', description: 'ERNIE-Bot 3.5' },
  { id: '9', name: '通义千问', version: 'v2.0', status: 'available', description: 'Qwen-Max' },
  { id: '10', name: '通义千问', version: 'v1.5', status: 'available', description: 'Qwen-Plus' },
  { id: '11', name: 'GLM-4', version: 'v1.0', status: 'available', description: '智谱清言' },
  { id: '12', name: 'GLM-3', version: 'v1.0', status: 'deprecated', description: '旧版本' },
];
