'use client';

import { useRouter } from 'next/navigation';
import { SidebarNav } from '@/components/sidebar-nav';
import { EvaluationWorkbench } from '@/components/evaluation-workbench';
import { SidebarTab } from '@/types/task';

export default function EvaluationWorkbenchPage() {
  const router = useRouter();
  
  const handleTabChange = (tab: SidebarTab) => {
    if (tab === 'list') {
      router.push('/');
    } else if (tab === 'step-create') {
      router.push('/evaluation/create');
    }
  };

  return (
    <>
      <SidebarNav activeTab="step-create" onTabChange={handleTabChange} />
      <EvaluationWorkbench />
    </>
  );
}
