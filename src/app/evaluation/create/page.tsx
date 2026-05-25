"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarTab } from "@/types/task";
import { SidebarNav } from "@/components/sidebar-nav";
import { EvaluationConfigPage } from "@/components/evaluation-config-page";

export default function EvaluationCreatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SidebarTab>('step-create');

  const handleTabChange = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab !== 'step-create') {
      // 如果切换到其他Tab，跳转回主页面
      router.push('/');
    }
  };

  return (
    <>
      {/* 左侧导航 - 固定定位 */}
      <SidebarNav activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* 右侧内容 */}
      <EvaluationConfigPage />
    </>
  );
}
