"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  Shield,
  Zap,
  Brain,
  Sparkles,
  Minimize2,
  Maximize2,
  X,
  Send,
  Bot,
  User,
  Clock,
  Star,
  ArrowRight,
  ExternalLink,
  FileText,
  Calendar
} from 'lucide-react';

import {
  AIChatAssistant,
  AIRecommendationPanel,
  AIInsightCard,
  AIAlert,
  AILiveBadge
} from '@/sdk/components/ai';

import {
  Conversation,
  Message,
  MessageContent,
  Reasoning,
  ChainOfThought,
  Suggestion,
  Sources,
  Task,
  Tool
} from '@/components/ai-elements';

interface ComplianceInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'violation' | 'improvement';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  sources: string[];
  recommendations: string[];
  timestamp: Date;
}

interface ComplianceCopilotProps {
  context: string;
  currentScore?: number;
  insights?: ComplianceInsight[];
  onInsightAction?: (insight: ComplianceInsight, action: string) => void;
  onGenerateReport?: () => void;
  onScheduleAudit?: () => void;
  className?: string;
}

export function AIComplianceCopilot({
  context,
  currentScore = 0,
  insights = [],
  onInsightAction,
  onGenerateReport,
  onScheduleAudit,
  className
}: ComplianceCopilotProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'recommendations'>('insights');
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'risk': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'violation': return Shield;
      case 'improvement': return Lightbulb;
      default: return Target;
    }
  };

  const quickActions = [
    {
      label: 'Generate Compliance Report',
      icon: FileText,
      action: onGenerateReport,
      description: 'Create detailed compliance analysis'
    },
    {
      label: 'Schedule Audit',
      icon: Calendar,
      action: onScheduleAudit,
      description: 'Plan next compliance review'
    },
    {
      label: 'Risk Assessment',
      icon: Shield,
      action: () => setActiveTab('insights'),
      description: 'Review current risk levels'
    },
    {
      label: 'AI Recommendations',
      icon: Brain,
      action: () => setActiveTab('recommendations'),
      description: 'Get AI-powered improvement suggestions'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
        className
      )}
    >
      <Card className="h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-slate-700 shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">
                  AI Compliance Copilot
                </CardTitle>
                <p className="text-xs text-slate-300">{context}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AILiveBadge status="live" pulse={true} size="sm" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-slate-400 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-1 overflow-hidden"
            >
              <CardContent className="p-0 h-full">
                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                  {[
                    { id: 'insights', label: 'Insights', icon: TrendingUp },
                    { id: 'chat', label: 'Chat', icon: MessageSquare },
                    { id: 'recommendations', label: 'Actions', icon: Zap }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1",
                        activeTab === tab.id
                          ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/10"
                          : "text-slate-400 hover:text-slate-300"
                      )}
                    >
                      <tab.icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="h-[480px] overflow-hidden">
                  {activeTab === 'insights' && (
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-3">
                        {/* Current Score */}
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">Compliance Score</span>
                            <Badge variant="outline" className="text-xs">
                              {currentScore}%
                            </Badge>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${currentScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Insights */}
                        <div className="space-y-2">
                          {insights.map((insight) => {
                            const Icon = getSeverityIcon(insight.type);
                            return (
                              <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-800/30 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full mt-2",
                                    getSeverityColor(insight.severity)
                                  )} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icon className="w-4 h-4 text-slate-400" />
                                      <span className="text-sm font-medium text-white truncate">
                                        {insight.title}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-xs",
                                          insight.severity === 'critical' && "border-red-500 text-red-400",
                                          insight.severity === 'high' && "border-orange-500 text-orange-400",
                                          insight.severity === 'medium' && "border-yellow-500 text-yellow-400",
                                          insight.severity === 'low' && "border-green-500 text-green-400"
                                        )}
                                      >
                                        {insight.severity}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-slate-300 mb-2">
                                      {insight.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-400">
                                        Confidence: {insight.confidence}%
                                      </span>
                                      {insight.recommendations.length > 0 && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-xs text-blue-400 hover:text-blue-300 h-6 px-2"
                                          onClick={() => onInsightAction?.(insight, 'view-recommendations')}
                                        >
                                          View Actions
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </ScrollArea>
                  )}

                  {activeTab === 'chat' && (
                    <div className="h-full flex flex-col">
                      <ScrollArea className="flex-1 p-4">
                        <Conversation className="space-y-4">
                          {messages.map((message) => (
                            <Message
                              key={message.id}
                              from={message.role}
                            >
                              <MessageContent>{message.content}</MessageContent>
                            </Message>
                          ))}
                        </Conversation>
                      </ScrollArea>
                      <div className="p-4 border-t border-slate-700">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ask about compliance..."
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommendations' && (
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-3">
                        {quickActions.map((action, index) => (
                          <motion.div
                            key={action.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-start h-auto p-3 bg-slate-800/30 border-slate-700 hover:bg-slate-700/50 text-left"
                              onClick={action.action}
                            >
                              <div className="flex items-start gap-3">
                                <action.icon className="w-5 h-5 text-blue-400 mt-0.5" />
                                <div>
                                  <div className="text-sm font-medium text-white">
                                    {action.label}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    {action.description}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}