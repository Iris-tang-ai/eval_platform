'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  FileText, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { Stepper, evaluationSteps } from './stepper';
import { Button } from './ui/button';
import { 
  EvaluationDimension, 
  EvaluationConfig, 
  MOCK_EVALUATION_CONFIG 
} from '@/types/task';
import { cn } from '@/lib/utils';

interface EvaluationWorkbenchProps {
  config?: EvaluationConfig;
}

// 难度标签颜色
const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

const difficultyLabels = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export function EvaluationWorkbench({ config = MOCK_EVALUATION_CONFIG }: EvaluationWorkbenchProps) {
  const router = useRouter();
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  // 下载评测集
  const handleDownload = (dimension: EvaluationDimension) => {
    // 构建JSON数据
    const data = {
      dimension: dimension.name,
      description: dimension.description,
      testCount: dimension.testCount,
      testCases: dimension.testCases.map(tc => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput || '',
        category: tc.category || '',
        difficulty: tc.difficulty || 'medium',
      })),
      exportedAt: new Date().toISOString(),
    };

    // 创建Blob并下载
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dimension.name.replace(/\s+/g, '_')}_test_cases.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 下载全部评测集
  const handleDownloadAll = () => {
    const data = {
      goal: config.goal,
      targetModels: config.targetModels,
      totalTestCount: config.totalTestCount,
      dimensions: config.dimensions.map(d => ({
        name: d.name,
        description: d.description,
        testCount: d.testCount,
        testCases: d.testCases.map(tc => ({
          id: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput || '',
          category: tc.category || '',
          difficulty: tc.difficulty || 'medium',
        })),
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation_test_cases_all.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 返回第一步
  const handleBack = () => {
    router.push('/evaluation/create');
  };

  // 进入第三步
  const handleNext = () => {
    router.push('/evaluation/report');
  };

  return (
    <div className="min-h-screen bg-slate-50 ml-[200px]">
      {/* 顶部步骤条 */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <Stepper steps={evaluationSteps} currentStep={2} />
      </div>

      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* 标题区 */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">能力评测工作台</h1>
          <p className="text-slate-500">
            已为您智能拆解出 <span className="font-medium text-slate-700">{config.dimensions.length}</span> 个评测维度，
            共计 <span className="font-medium text-slate-700">{config.totalTestCount}</span> 条测试用例
          </p>
        </div>

        {/* 概览卡片 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-slate-600" />
                <h2 className="font-medium text-slate-900">评测目标</h2>
              </div>
              <p className="text-slate-600 mb-4">{config.goal}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  <span>目标模型：{config.targetModels.join('、')}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              className="ml-4 shrink-0"
            >
              <Download className="h-4 w-4 mr-2" />
              下载全部评测集
            </Button>
          </div>
        </div>

        {/* 维度列表 */}
        <div className="space-y-4">
          {config.dimensions.map((dimension, index) => (
            <div 
              key={dimension.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* 维度头部 */}
              <div 
                className={cn(
                  "p-6 cursor-pointer transition-all duration-200",
                  "hover:bg-slate-50"
                )}
                onClick={() => setExpandedDimension(
                  expandedDimension === dimension.id ? null : dimension.id
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-slate-900 text-lg">{dimension.name}</h3>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                        {dimension.testCount} 条用例
                      </span>
                    </div>
                    <p className="text-slate-500 ml-10">{dimension.description}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(dimension);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      下载
                    </Button>
                    <ChevronRight 
                      className={cn(
                        "h-5 w-5 text-slate-400 transition-transform duration-200",
                        expandedDimension === dimension.id && "rotate-90"
                      )} 
                    />
                  </div>
                </div>
              </div>

              {/* 展开的测试用例预览 */}
              {expandedDimension === dimension.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-6">
                  <h4 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    测试用例预览
                  </h4>
                  <div className="space-y-3">
                    {dimension.testCases.map((tc) => (
                      <div 
                        key={tc.id}
                        className="bg-white rounded-lg border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {tc.category && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                {tc.category}
                              </span>
                            )}
                            {tc.difficulty && (
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs",
                                difficultyColors[tc.difficulty]
                              )}>
                                {difficultyLabels[tc.difficulty]}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          <span className="text-slate-500 font-medium">输入：</span>
                          {tc.input}
                        </p>
                      </div>
                    ))}
                  </div>
                  {dimension.testCount > dimension.testCases.length && (
                    <p className="text-sm text-slate-500 mt-4 text-center">
                      还有 {dimension.testCount - dimension.testCases.length} 条测试用例，
                      点击"下载"查看完整评测集
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部固定操作栏 */}
      <div className="fixed bottom-0 left-[200px] right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回上一步
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            开始执行评测
          </Button>
        </div>
      </div>
    </div>
  );
}
