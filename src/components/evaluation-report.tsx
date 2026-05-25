'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  XCircle,
  Search,
  BarChart3,
  Activity,
  DollarSign,
  Database,
} from 'lucide-react';
import { Stepper } from './stepper';
import { SidebarNav } from './sidebar-nav';
import {
  EvaluationSummary,
  EvaluationDetail,
  MOCK_COMPLETED_EVALUATIONS,
  MOCK_MODEL_RESULTS,
  MOCK_EVALUATION_DETAILS,
  ModelEvaluationResult,
  SidebarTab,
} from '@/types/task';

export default function EvaluationReport() {
  const router = useRouter();
  const [selectedTaskId, setSelectedTaskId] = useState<string>(MOCK_COMPLETED_EVALUATIONS[0].taskId);
  const [searchPrompt, setSearchPrompt] = useState('');
  const [showOnlyFailed, setShowOnlyFailed] = useState(false);

  // 选中的任务
  const selectedTask = useMemo(() => {
    return MOCK_COMPLETED_EVALUATIONS.find(t => t.taskId === selectedTaskId);
  }, [selectedTaskId]);

  // 过滤后的详情数据
  const filteredDetails = useMemo(() => {
    let details = MOCK_EVALUATION_DETAILS;
    
    if (showOnlyFailed) {
      details = details.filter(d => d.status === 'fail');
    }
    
    if (searchPrompt) {
      const search = searchPrompt.toLowerCase();
      details = details.filter(
        d => d.prompt.toLowerCase().includes(search) ||
             d.modelOutput.toLowerCase().includes(search)
      );
    }
    
    return details;
  }, [showOnlyFailed, searchPrompt]);

  // 雷达图数据
  const radarData = useMemo(() => {
    const model = MOCK_MODEL_RESULTS[0];
    return model.dimensions.map(d => ({
      dimension: d.dimensionName.length > 6 
        ? d.dimensionName.slice(0, 6) + '...' 
        : d.dimensionName,
      fullDimension: d.dimensionName,
      score: d.score,
      fullScore: 100,
    }));
  }, []);

  // 柱状图数据（各模型对比）
  const barData = useMemo(() => {
    return MOCK_MODEL_RESULTS.map(m => ({
      name: m.modelName.length > 10 ? m.modelName.slice(0, 10) + '...' : m.modelName,
      fullName: m.modelName,
      准确率: m.accuracy,
      '延迟(ms)': m.avgLatency,
    }));
  }, []);

  const handleBack = () => {
    router.push('/evaluation/workbench');
  };

  const handleDownload = () => {
    const data = {
      summary: selectedTask,
      modelResults: MOCK_MODEL_RESULTS,
      details: filteredDetails,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation_report_${selectedTaskId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 固定左侧导航 */}
      <SidebarNav activeTab="step-create" onTabChange={(tab: SidebarTab) => {
        if (tab !== 'step-create') {
          router.push('/');
        }
      }} />
      
      {/* 主内容区 */}
      <div className="ml-[200px]">
        {/* 顶部步骤条 */}
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <Stepper currentStep={3} steps={[
            { id: 1, title: '配置评测目标' },
            { id: 2, title: '能力评测工作台' },
            { id: 3, title: '可视化洞察报告' },
          ]} />
        </div>

        <div className="p-8">
          {/* 任务选择器 */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              选择已完成的评测任务
            </label>
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="请选择评测任务" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_COMPLETED_EVALUATIONS.map(task => (
                  <SelectItem key={task.taskId} value={task.taskId}>
                    <div className="flex items-center gap-2">
                      <span>{task.taskName}</span>
                      <span className="text-slate-400 text-xs">
                        ({formatDate(task.completedAt)})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTask && (
            <>
              {/* 核心指标看板 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm text-slate-500">综合准确率</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {selectedTask.accuracy}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    通过 {selectedTask.passCount} / {selectedTask.totalSamples}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-500">平均延迟</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {selectedTask.avgLatency}
                    <span className="text-lg font-normal text-slate-400">ms</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-slate-500">消耗成本</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    ${selectedTask.totalCost.toFixed(2)}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Database className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="text-sm text-slate-500">测试样本</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {selectedTask.totalSamples}
                    <span className="text-lg font-normal text-slate-400">条</span>
                  </div>
                </div>
              </div>

              {/* 图表可视化 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* 雷达图 */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                    多维度能力分布
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis 
                          dataKey="dimension" 
                          tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]}
                          tick={{ fill: '#94a3b8', fontSize: 10 }}
                        />
                        <Radar
                          name="得分"
                          dataKey="score"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-sm text-slate-500 mt-2">
                    GPT-4o 各维度得分分布
                  </div>
                </div>

                {/* 柱状图 */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                    各模型性能对比
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <YAxis 
                          tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="准确率" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="延迟(ms)" 
                          fill="#94a3b8" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 详细数据表格 */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    评测详情列表
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="搜索 Prompt..."
                        value={searchPrompt}
                        onChange={(e) => setSearchPrompt(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button
                      variant={showOnlyFailed ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowOnlyFailed(!showOnlyFailed)}
                    >
                      {showOnlyFailed ? '显示全部' : '仅看失败案例'}
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead className="min-w-[200px]">Prompt</TableHead>
                        <TableHead className="min-w-[150px]">黄金答案</TableHead>
                        <TableHead className="min-w-[200px]">模型输出</TableHead>
                        <TableHead className="w-[80px]">状态</TableHead>
                        <TableHead className="w-[80px]">得分</TableHead>
                        <TableHead className="w-[100px]">模型</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDetails.map(detail => (
                        <TableRow key={detail.id}>
                          <TableCell className="font-mono text-xs">
                            {detail.sampleId}
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="truncate text-sm" title={detail.prompt}>
                              {detail.prompt}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[150px]">
                            <div className="truncate text-sm text-slate-600" title={detail.groundTruth}>
                              {detail.groundTruth}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="truncate text-sm" title={detail.modelOutput}>
                              {detail.modelOutput}
                            </div>
                          </TableCell>
                          <TableCell>
                            {detail.status === 'pass' ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Pass
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                <XCircle className="w-3 h-3 mr-1" />
                                Fail
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {detail.score}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {detail.modelName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 text-sm text-slate-500">
                  共 {filteredDetails.length} 条记录
                </div>
              </div>
            </>
          )}

          {/* 底部操作栏 */}
          <div className="fixed bottom-0 left-[200px] right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回工作台
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  导出报告
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
