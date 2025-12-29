'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { AssistantModal } from '@/components/assistant-ui/assistant-modal';
import { TooltipProvider } from '@/components/ui/tooltip';

export function AssistantChatProvider() {
  // useChatRuntime defaults to /api/chat endpoint
  const runtime = useChatRuntime();

  return (
    <TooltipProvider>
      <AssistantRuntimeProvider runtime={runtime}>
        <AssistantModal />
      </AssistantRuntimeProvider>
    </TooltipProvider>
  );
}
