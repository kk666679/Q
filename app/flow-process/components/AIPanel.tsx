/**
 * AI Panel Component
 * 
 * Right sidebar panel for AI workflow assistant with chat interface.
 * Uses AI Elements from @/components/ai-elements for consistent UI.
 */

"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Loader2,
  Copy,
  RefreshCw,
  Zap,
  MessageSquare,
  Settings,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import AI Elements components for rich message display
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";

import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";

import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import {
  PromptInput,
  PromptInputProvider,
} from "@/components/ai-elements/prompt-input";

import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector";

export interface WorkflowMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  reasoning?: string;
  tools?: Array<{
    name: string;
    input: Record<string, any>;
    output?: any;
    error?: string;
  }>;
}

export interface AIPanelProps {
  /** Current messages */
  messages?: WorkflowMessage[];
  /** Input value */
  inputValue?: string;
  /** Callback when input changes */
  onInputChange?: (value: string) => void;
  /** Callback when message is sent */
  onSendMessage?: (message: string) => void;
  /** Callback when chat is cleared */
  onClearChat?: () => void;
  /** Whether AI is processing */
  isProcessing?: boolean;
  /** Whether AI is enabled */
  enabled?: boolean;
  /** Currently selected model */
  selectedModel?: string;
  /** Available models */
  availableModels?: Array<{
    id: string;
    name: string;
    provider: string;
  }>;
  /** Callback when model changes */
  onModelChange?: (modelId: string) => void;
  /** Additional className */
  className?: string;
}

const defaultModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "anthropic" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "google" },
];

const defaultGreeting: WorkflowMessage = {
  id: "greeting",
  role: "assistant",
  content: "Hello! I'm your AI Workflow Assistant. I can help you:\n\n• Create new workflows from scratch\n• Modify existing workflows\n• Add or remove nodes\n• Suggest improvements\n• Explain how nodes work\n\nHow can I help you today?",
  timestamp: new Date(),
};

export function AIPanel({
  messages = [],
  inputValue = "",
  onInputChange,
  onSendMessage,
  onClearChat,
  isProcessing = false,
  enabled = true,
  selectedModel = "gpt-4o",
  availableModels = defaultModels,
  onModelChange,
  className,
}: AIPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localInput, setLocalInput] = useState(inputValue);
  const [isModelOpen, setIsModelOpen] = useState(false);

  // Sync local input with prop
  useEffect(() => {
    setLocalInput(inputValue);
  }, [inputValue]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (localInput.trim() && !isProcessing) {
      onSendMessage?.(localInput);
      setLocalInput("");
    }
  }, [localInput, isProcessing, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const currentModel = useMemo(() => {
    return availableModels.find(m => m.id === selectedModel) || availableModels[0];
  }, [availableModels, selectedModel]);

  if (!enabled) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-4 text-center", className)}>
        <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">AI Assistant Disabled</p>
        <p className="text-xs text-muted-foreground mt-1">
          Enable AI to get workflow assistance.
        </p>
      </div>
    );
  }

  const displayMessages = messages.length === 0 ? [defaultGreeting] : messages;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header with Model Selector */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">AI Assistant</span>
        </div>
        
        {/* Model Selector */}
        <ModelSelector open={isModelOpen} onOpenChange={setIsModelOpen}>
          <ModelSelectorTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              <span className="max-w-[100px] truncate">{currentModel?.name || "Select Model"}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </ModelSelectorTrigger>
          <ModelSelectorContent>
            <ModelSelectorInput placeholder="Search models..." />
            <ModelSelectorList>
              <ModelSelectorGroup heading="Available Models">
                {availableModels.map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    value={model.id}
                    onSelect={() => {
                      onModelChange?.(model.id);
                      setIsModelOpen(false);
                    }}
                  >
                    <ModelSelectorName>{model.name}</ModelSelectorName>
                    <ModelSelectorLogoGroup>
                      <ModelSelectorLogo provider={model.provider} />
                    </ModelSelectorLogoGroup>
                  </ModelSelectorItem>
                ))}
              </ModelSelectorGroup>
            </ModelSelectorList>
          </ModelSelectorContent>
        </ModelSelector>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full max-w-[95%]",
              message.role === "user" ? "ml-auto justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "group rounded-lg p-3 max-w-[85%]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted border"
              )}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-2">
                {message.role === "user" ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
                <span className="text-xs font-medium">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </span>
                {message.isLoading && (
                  <Badge variant="outline" className="text-xs animate-pulse">
                    <Loader2 className="h-2 w-2 mr-1 animate-spin" />
                    Thinking
                  </Badge>
                )}
              </div>

              {/* Reasoning (if available) */}
              {message.reasoning && (
                <Reasoning>
                  <ReasoningTrigger>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Show reasoning
                  </ReasoningTrigger>
                  <ReasoningContent>
                    {message.reasoning}
                  </ReasoningContent>
                </Reasoning>
              )}

              {/* Tools (if available) */}
              {message.tools && message.tools.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.tools.map((tool, idx) => (
                    <Tool key={idx} defaultOpen={false}>
                      <ToolHeader title={tool.name} type={`tool-${tool.name}`} state={tool.error ? "output-error" : "output-available"} />
                      <ToolContent>
                        <ToolInput input={tool.input} />
                        {tool.output && <ToolOutput output={tool.output} errorText={tool.error} />}
                        {tool.error && (
                          <div className="text-xs text-red-500 mt-2">
                            Error: {tool.error}
                          </div>
                        )}
                      </ToolContent>
                    </Tool>
                  ))}
                </div>
              )}

              {/* Message Content */}
              <div className="text-sm whitespace-pre-wrap">
                {message.isLoading ? (
                  <div className="flex items-center gap-2 py-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs opacity-70">Processing...</span>
                  </div>
                ) : (
                  message.content
                )}
              </div>

              {/* Timestamp */}
              <div className="text-xs opacity-50 mt-2 flex items-center justify-between">
                <span>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                
                {/* Copy Button */}
                {message.content && !message.isLoading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigator.clipboard.writeText(message.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-background">
        <div className="relative">
          <textarea
            value={localInput}
            onChange={(e) => {
              setLocalInput(e.target.value);
              onInputChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to create or modify your workflow..."
            disabled={isProcessing}
            className="w-full min-h-[80px] resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            rows={3}
          />
          
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearChat}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSend}
              disabled={isProcessing || !localInput.trim()}
              className="h-8"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI can help generate and modify workflows. Press Enter to send.
        </p>
      </div>
    </div>
  );
}

export default AIPanel;

