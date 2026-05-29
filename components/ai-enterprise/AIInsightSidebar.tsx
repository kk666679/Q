"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  Users,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Info,
  AlertCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share,
  Bookmark,
  ExternalLink,
  Settings,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  AIInsightCard,
  AIRecommendationPanel,
  AILiveBadge,
  AIAlert,
} from '@/sdk/components/ai';

import {
  Reasoning,
  ChainOfThought,
  Suggestion,
  Sources,
  Task,
  Tool,
  Context
} from '@/components/ai-elements';

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'insight' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  data?: any;
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
  timestamp: Date;
  source?: string;
  tags?: string[];
}

interface AIInsightSidebarProps {
  insights?: AIInsight[];
  isOpen?: boolean;
  onToggle?: () => void;
  onInsightAction?: (insight: AIInsight, action: string) => void;
  onInsightFeedback?: (insightId: string, feedback: 'positive' | 'negative') => void;
  currentContext?: string;
  className?: string;
}

export function AIInsightSidebar({
  insights = [],
  isOpen = true,
  onToggle,
  onInsightAction,
  onInsightFeedback,
  currentContext = 'General',
  className
}: AIInsightSidebarProps) {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'confidence' | 'impact' | 'timestamp'>('confidence');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'recommendation': return Lightbulb;
      case 'alert': return AlertTriangle;
      case 'insight': return Brain;
      case 'trend': return BarChart3;
      default: return Info;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'text-blue-400';
      case 'recommendation': return 'text-purple-400';
      case 'alert': return 'text-red-400';
      case 'insight': return 'text-cyan-400';
      case 'trend': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const filteredInsights = insights
    .filter(insight => filter === 'all' || insight.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'impact':
          const impactOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
        case 'timestamp':
          return b.timestamp.getTime() - a.timestamp.getTime();
        default:
          return 0;
      }
    });

  const categories = Array.from(new Set(insights.map(i => i.category)));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className={cn(
            "fixed right-0 top-0 h-full w-96 bg-slate-900/95 backdrop-blur-sm border-l border-slate-700 z-40",
            className
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                    <p className="text-sm text-slate-300">{currentContext}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AILiveBadge status="live" pulse={true} size="sm" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="text-slate-400 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === 'all' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="text-xs"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filter === category ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(category)}
                    className="text-xs capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {/* Sort Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      {filteredInsights.length} insights
                    </span>
                    <div className="flex gap-1">
                      {[
                        { key: 'confidence', label: 'Confidence' },
                        { key: 'impact', label: 'Impact' },
                        { key: 'timestamp', label: 'Recent' }
                      ].map((sort) => (
                        <Button
                          key={sort.key}
                          variant={sortBy === sort.key ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setSortBy(sort.key as any)}
                          className="text-xs h-6 px-2"
                        >
                          {sort.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Insights List */}
                  <div className="space-y-3">
                    {filteredInsights.map((insight, index) => {
                      const Icon = getInsightIcon(insight.type);
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]",
                            getImpactColor(insight.impact),
                            selectedInsight?.id === insight.id && "ring-2 ring-blue-500/50"
                          )}
                          onClick={() => setSelectedInsight(insight)}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", getTypeColor(insight.type))} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-white text-sm truncate">
                                  {insight.title}
                                </h4>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {insight.type}
                                </Badge>
                              </div>

                              <p className="text-xs text-slate-300 mb-3 line-clamp-2">
                                {insight.description}
                              </p>

                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400">Confidence:</span>
                                  <div className="flex items-center gap-1">
                                    <Progress value={insight.confidence} className="w-12 h-1" />
                                    <span className="text-xs text-slate-300">{insight.confidence}%</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className={cn("text-xs", getImpactColor(insight.impact))}>
                                  {insight.impact}
                                </Badge>
                              </div>

                              {insight.tags && insight.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {insight.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                  {insight.timestamp.toLocaleTimeString()}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs h-6 px-2 text-green-400 hover:text-green-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onInsightFeedback?.(insight.id, 'positive');
                                    }}
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs h-6 px-2 text-red-400 hover:text-red-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onInsightFeedback?.(insight.id, 'negative');
                                    }}
                                  >
                                    <ThumbsDown className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>

                              {insight.actions && insight.actions.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                  {insight.actions.map((action) => (
                                    <Button
                                      key={action.action}
                                      size="sm"
                                      variant={action.primary ? "default" : "outline"}
                                      className="text-xs h-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onInsightAction?.(insight, action.action);
                                      }}
                                    >
                                      {action.label}
                                      <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {filteredInsights.length === 0 && (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-400">No insights available</p>
                      <p className="text-xs text-slate-500 mt-1">
                        AI insights will appear here as they become available
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-400">Powered by AI</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40"
        >
          <Button
            onClick={onToggle}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-slate-700/80 rounded-l-lg rounded-r-none h-12 px-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="ml-2 flex flex-col items-start">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-300">AI</span>
            </div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}