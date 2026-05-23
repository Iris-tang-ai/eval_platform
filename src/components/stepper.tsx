"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav className={cn("w-full", className)}>
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Step circle with number or checkmark */}
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                    isCompleted && "bg-violet-600 text-white",
                    isCurrent && "bg-violet-600 text-white ring-4 ring-violet-600/20",
                    !isCompleted && !isCurrent && "bg-slate-200 text-slate-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                  
                  {/* Breathing dot for current step */}
                  {isCurrent && (
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-500" />
                    </span>
                  )}
                </div>
                
                {/* Step title */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      isCurrent && "text-violet-600",
                      isCompleted && "text-slate-700",
                      !isCompleted && !isCurrent && "text-slate-400"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-xs text-slate-400 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
                
                {/* Purple underline for current step */}
                {isCurrent && (
                  <div className="mt-2 h-0.5 w-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                )}
              </div>

              {/* Connector line between steps */}
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 sm:mx-4 h-0.5 w-8 sm:w-16 rounded-full transition-colors duration-200",
                    isCompleted ? "bg-violet-300" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Default steps for evaluation task creation
export const evaluationSteps: Step[] = [
  {
    id: 1,
    title: "配置评测目标",
    description: "定义目标与数据集",
  },
  {
    id: 2,
    title: "能力评测工作台",
    description: "配置评测维度",
  },
  {
    id: 3,
    title: "可视化洞察报告",
    description: "查看评测结果",
  },
];
