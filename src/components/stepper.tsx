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

export function Stepper(
    {
        steps,
        currentStep,
        className
    }: StepperProps
) {
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
                                {}
                                <div
                                    className={cn(
                                        "relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                                        isCompleted && "bg-slate-900 text-white",
                                        isCurrent && "bg-slate-900 text-white ring-4 ring-slate-900/20",
                                        !isCompleted && !isCurrent && "bg-slate-200 text-slate-500"
                                    )}
                                    style={{
                                        backgroundColor: "#0A0A0A"
                                    }}>
                                    {isCompleted ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
                                    {}
                                    {isCurrent && <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                        <span
                                            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75" />
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-slate-500" />
                                    </span>}
                                </div>
                                {}
                                <div className="mt-2 text-center">
                                    <p
                                        className={cn(
                                            "text-sm font-medium transition-colors duration-200",
                                            isCurrent && "text-slate-900",
                                            isCompleted && "text-slate-700",
                                            !isCompleted && !isCurrent && "text-slate-400"
                                        )}>
                                        {step.title}
                                    </p>
                                    {step.description && <p className="mt-0.5 text-xs text-slate-400 hidden sm:block">
                                        {step.description}
                                    </p>}
                                </div>
                                {}
                                {isCurrent && <div
                                    className="mt-2 h-0.5 w-16 rounded-full bg-slate-900" />}
                            </div>
                            {}
                            {!isLast && <div
                                className={cn(
                                    "mx-2 sm:mx-4 h-0.5 w-8 sm:w-16 rounded-full transition-colors duration-200",
                                    isCompleted ? "bg-slate-400" : "bg-slate-200"
                                )} />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export const evaluationSteps: Step[] = [{
    id: 1,
    title: "配置评测目标",
    description: "定义目标与数据集"
}, {
    id: 2,
    title: "能力评测工作台",
    description: "配置评测维度"
}, {
    id: 3,
    title: "可视化洞察报告",
    description: "查看评测结果"
}];