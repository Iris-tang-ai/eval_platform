"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  UploadCloud, 
  Check, 
  Trash2, 
  ChevronDown,
  Info,
  ArrowLeft,
  Zap
} from "lucide-react";
import { Stepper, evaluationSteps } from "./stepper";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Model options with brand colors
const modelOptions = [
  { id: "gpt-4o", name: "GPT-4o", color: "#10A37F" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", color: "#CC785C" },
  { id: "llama-3-70b", name: "Llama-3-70B", color: "#6366F1" },
];

// Quick prompt starters
const promptStarters = [
  { id: 1, label: "客服冲突降级测试", text: "测试我们的智能客服大模型在面对愤怒客户时的安抚能力、危机升级判断，以及是否严格遵守金融合规话术准则。" },
  { id: 2, label: "金融合规性审查", text: "评测模型在金融产品推荐场景下的合规性，包括风险提示完整性、投资建议免责声明、以及对用户风险承受能力的准确评估。" },
  { id: 3, label: "Prompt 注入防御攻击", text: "测试模型对各类Prompt注入攻击的防御能力，包括角色扮演绕过、指令覆盖、数据泄露诱导等多种攻击向量。" },
];

// AI generation strategies
const aiStrategies = [
  { 
    id: "edge-cases", 
    label: "极端情况压力测试（Edge-Cases）",
    tooltip: "生成边界条件和极端输入场景，测试模型在异常情况下的表现"
  },
  { 
    id: "semantic-rewrite", 
    label: "语义泛化与改写",
    tooltip: "对原始Query进行语义等价的多样化改写，提升评测覆盖面"
  },
  { 
    id: "adversarial", 
    label: "对抗性指令注入",
    tooltip: "生成包含恶意指令或诱导性内容的测试用例"
  },
];

// Mock uploaded file
const mockUploadedFile = {
  name: "customer_queries_v2.json",
  size: "452 KB",
  uploadedAt: "2024-01-17 14:32",
};

export function EvaluationConfigPage() {
  // State
  const [goalText, setGoalText] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4o"]);
  const [uploadedFile, setUploadedFile] = useState(mockUploadedFile);
  const [aiExpandEnabled, setAiExpandEnabled] = useState(true);
  const [expandRatio, setExpandRatio] = useState(2);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(["edge-cases", "semantic-rewrite"]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Handlers
  const handlePromptStarterClick = (text: string) => {
    setGoalText(text);
  };

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleStrategyToggle = (strategyId: string) => {
    setSelectedStrategies(prev =>
      prev.includes(strategyId)
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const handleFileDelete = () => {
    setUploadedFile(null as any);
  };

  return (
    <div className="ml-[200px] min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation - Stepper */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Stepper steps={evaluationSteps} currentStep={1} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Left Column - AI Intent & Goal Configuration (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Card Container */}
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">定义评测目标</h2>
                <p className="mt-1 text-sm text-slate-500">
                  请使用自然语言描述您想测试的业务场景与核心考点
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Large Textarea */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    评测目标描述
                  </label>
                  <textarea
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    placeholder="例如：测试我们的智能客服大模型在面对愤怒客户时的安抚能力、危机升级判断，以及是否严格遵守金融合规话术准则……"
                    className={cn(
                      "w-full h-40 px-4 py-3 text-sm rounded-lg border border-slate-200",
                      "placeholder:text-slate-400 placeholder:leading-relaxed",
                      "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent",
                      "transition-all duration-200 resize-none"
                    )}
                  />
                </div>

                {/* Quick Prompt Starters */}
                <div>
                  <p className="text-xs text-slate-500 mb-3">快速开始：</p>
                  <div className="flex flex-wrap gap-2">
                    {promptStarters.map((starter) => (
                      <button
                        key={starter.id}
                        onClick={() => handlePromptStarterClick(starter.text)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full",
                          "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700",
                          "border border-slate-200 hover:border-slate-300",
                          "transition-all duration-200 cursor-pointer"
                        )}
                      >
                        {starter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    待评测的目标模型
                  </label>
                  
                  {/* Selected Models Display */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedModels.map((modelId) => {
                      const model = modelOptions.find(m => m.id === modelId);
                      if (!model) return null;
                      return (
                        <Badge
                          key={model.id}
                          variant="secondary"
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                        >
                          <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: model.color }}
                          />
                          {model.name}
                          <button
                            onClick={() => handleModelToggle(model.id)}
                            className="ml-2 hover:text-slate-900"
                          >
                            ×
                          </button>
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Model Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm rounded-lg",
                        "border border-slate-200 bg-white",
                        "hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400",
                        "transition-all duration-200 flex items-center justify-between"
                      )}
                    >
                      <span className="text-slate-500">选择模型...</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200",
                        showModelDropdown && "rotate-180"
                      )} />
                    </button>

                    {showModelDropdown && (
                      <div className={cn(
                        "absolute top-full left-0 right-0 mt-1",
                        "bg-white border border-slate-200 rounded-lg shadow-lg",
                        "z-50 overflow-hidden"
                      )}>
                        {modelOptions.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => handleModelToggle(model.id)}
                            className={cn(
                              "w-full px-4 py-2.5 text-left text-sm",
                              "flex items-center gap-3",
                              "hover:bg-slate-50 transition-colors duration-150",
                              selectedModels.includes(model.id) && "bg-slate-100"
                            )}
                          >
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: model.color }}
                            />
                            <span className={cn(
                              "flex-1",
                              selectedModels.includes(model.id) ? "text-slate-900 font-medium" : "text-slate-700"
                            )}>
                              {model.name}
                            </span>
                            {selectedModels.includes(model.id) && (
                              <Check className="h-4 w-4 text-slate-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Data Assets & AI Extension (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Original Dataset Upload */}
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">原始评测集</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Drag & Drop Zone */}
                <div className={cn(
                  "border-2 border-dashed border-slate-200 rounded-lg",
                  "p-6 text-center",
                  "hover:border-slate-400 hover:bg-slate-50",
                  "transition-all duration-200 cursor-pointer"
                )}>
                  <UploadCloud className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    拖拽评测数据集文件至此处
                  </p>
                  <p className="text-xs text-slate-400">
                    支持 .json, .csv 格式，或从平台数据集仓库浏览选择
                  </p>
                </div>

                {/* Uploaded File Display */}
                {uploadedFile && (
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-green-50 rounded-lg border border-green-200">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {uploadedFile.size} · {uploadedFile.uploadedAt}
                      </p>
                    </div>
                    <button
                      onClick={handleFileDelete}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: AI Dataset Auto-Extension */}
            <div className={cn(
              "rounded-xl border shadow-sm overflow-hidden",
              "bg-slate-50",
              "border-slate-200"
            )}>
              {/* Header with Toggle */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">AI 数据集智能扩展</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">启用</span>
                  <Switch
                    checked={aiExpandEnabled}
                    onCheckedChange={setAiExpandEnabled}
                  />
                </div>
              </div>

              {/* Expandable Content */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                aiExpandEnabled ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="p-5 space-y-5">
                  {/* Expansion Ratio Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">
                        扩展比例
                      </label>
                      <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-mono">
                        {expandRatio}x
                      </Badge>
                    </div>
                    <Slider
                      value={[expandRatio]}
                      onValueChange={([v]) => setExpandRatio(v)}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1x (原始)</span>
                      <span>5x (最大扩展)</span>
                    </div>
                  </div>

                  {/* AI Generation Strategies */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-3 block">
                      AI 生成策略
                    </label>
                    <TooltipProvider>
                      <div className="space-y-2">
                        {aiStrategies.map((strategy) => (
                          <label
                            key={strategy.id}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-lg cursor-pointer",
                              "border transition-all duration-200",
                              selectedStrategies.includes(strategy.id)
                                ? "border-slate-400 bg-slate-100"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStrategies.includes(strategy.id)}
                              onChange={() => handleStrategyToggle(strategy.id)}
                              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                            />
                            <div className="flex-1">
                              <span className={cn(
                                "text-sm",
                                selectedStrategies.includes(strategy.id)
                                  ? "text-slate-900 font-medium"
                                  : "text-slate-700"
                              )}>
                                {strategy.label}
                              </span>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <p className="text-xs">{strategy.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </label>
                        ))}
                      </div>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Bar */}
      <footer className="sticky bottom-0 z-30 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回仪表盘
            </Button>

            {/* Right: Primary Action */}
            <Button
              className={cn(
                "px-6 py-2.5 text-sm font-medium",
                "bg-slate-900 hover:bg-slate-800",
                "text-white rounded-lg shadow-lg shadow-slate-500/20",
                "hover:shadow-xl hover:shadow-slate-500/30",
                "hover:scale-105",
                "transition-all duration-200"
              )}
            >
              <Zap className="h-4 w-4 mr-2" />
              分析并生成评测规格
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
