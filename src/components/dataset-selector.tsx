'use client';

import * as React from 'react';
import { Upload, Cloud, X, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Dataset, DatasetUploadType, CloudDataset } from '@/types/task';

// 支持的文件格式
const ACCEPTED_FORMATS = '.json,.jsonl,.csv,.zip';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// 模拟云端数据集列表
const MOCK_CLOUD_DATASETS: CloudDataset[] = [
  {
    type: 'cloud',
    id: '1',
    name: '大模型评测数据集-v1.0',
    size: 25.6 * 1024 * 1024,
    createdAt: new Date('2024-01-15'),
  },
  {
    type: 'cloud',
    id: '2',
    name: '图像分类测试集-2024',
    size: 156.2 * 1024 * 1024,
    createdAt: new Date('2024-02-20'),
  },
  {
    type: 'cloud',
    id: '3',
    name: '语音识别样本库',
    size: 89.4 * 1024 * 1024,
    createdAt: new Date('2024-03-10'),
  },
];

// 格式化文件大小
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

interface DatasetSelectorProps {
  value?: Dataset;
  onChange: (dataset: Dataset | undefined) => void;
}

export function DatasetSelector({ value, onChange }: DatasetSelectorProps) {
  const [uploadType, setUploadType] = React.useState<DatasetUploadType>('local');
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [cloudSearchQuery, setCloudSearchQuery] = React.useState('');

  // 过滤云端数据集
  const filteredCloudDatasets = React.useMemo(() => {
    if (!cloudSearchQuery) return MOCK_CLOUD_DATASETS;
    return MOCK_CLOUD_DATASETS.filter((ds) =>
      ds.name.toLowerCase().includes(cloudSearchQuery.toLowerCase())
    );
  }, [cloudSearchQuery]);

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    setError(null);

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      setError('文件大小不能超过100MB');
      return;
    }

    // 检查文件格式
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['json', 'jsonl', 'csv', 'zip'].includes(ext || '')) {
      setError('仅支持 .json、.jsonl、.csv、.zip 格式');
      return;
    }

    onChange({
      type: 'local',
      file,
      name: file.name,
      size: file.size,
    });
  };

  // 处理拖拽
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // 处理点击上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // 处理云端数据集选择
  const handleCloudSelect = (datasetId: string) => {
    const dataset = MOCK_CLOUD_DATASETS.find((ds) => ds.id === datasetId);
    if (dataset) {
      onChange(dataset);
    }
  };

  // 清除选择
  const handleClear = () => {
    setError(null);
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 切换上传方式时清除已选数据集
  const handleUploadTypeChange = (type: DatasetUploadType) => {
    setUploadType(type);
    handleClear();
  };

  return (
    <div className="space-y-4">
      {/* 上传方式切换 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleUploadTypeChange('local')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            uploadType === 'local'
              ? 'bg-zinc-900 text-white'
              : 'bg-transparent text-zinc-500 hover:bg-zinc-100'
          )}
        >
          <Upload className="h-4 w-4" />
          本地上传
        </button>
        <button
          type="button"
          onClick={() => handleUploadTypeChange('cloud')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            uploadType === 'cloud'
              ? 'bg-zinc-900 text-white'
              : 'bg-transparent text-zinc-500 hover:bg-zinc-100'
          )}
        >
          <Cloud className="h-4 w-4" />
          云端上传
        </button>
      </div>

      {/* 本地上传 */}
      {uploadType === 'local' && (
        <div>
          {!value || value.type !== 'local' ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              )}
            >
              <Upload className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
              <p className="text-sm text-zinc-600 mb-1">
                拖拽文件到此处，或点击选择文件
              </p>
              <p className="text-xs text-zinc-400">
                支持 .json、.jsonl、.csv、.zip 格式，最大 100MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FORMATS}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {value.name}
                  </p>
                  <p className="text-xs text-zinc-500">{formatSize(value.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-zinc-200 rounded transition-colors"
              >
                <X className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 云端上传 */}
      {uploadType === 'cloud' && (
        <div>
          {!value || value.type !== 'cloud' ? (
            <div className="space-y-3">
              <Select onValueChange={handleCloudSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="选择云端数据集" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCloudDatasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      <div className="flex items-center gap-2">
                        <span>{dataset.name}</span>
                        <span className="text-xs text-zinc-400">
                          ({formatSize(dataset.size)})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500">
                已有 {MOCK_CLOUD_DATASETS.length} 个云端数据集可用
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {value.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatSize(value.size)} · 创建于{' '}
                    {value.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-zinc-200 rounded transition-colors"
              >
                <X className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
