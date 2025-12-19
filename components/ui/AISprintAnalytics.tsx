'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Brain,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface SprintData {
  id: string;
  name: string;
  status: string;
  issues: any[];
  startDate: string;
  endDate: string;
}

interface AISprintAnalyticsProps {
  sprintData: SprintData;
  className?: string;
}

interface AnalyticsData {
  totalIssues: number;
  completedIssues: number;
  inProgressIssues: number;
  todoIssues: number;
  completionRate: number;
  aiInsights: string;
}

const AISprintAnalytics: React.FC<AISprintAnalyticsProps> = ({
  sprintData,
  className
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (sprintData?.issues) {
      calculateAnalytics();
    }
  }, [sprintData]);

  const calculateAnalytics = () => {
    const issues = sprintData.issues || [];
    const totalIssues = issues.length;
    const completedIssues = issues.filter(issue => issue.status === 'DONE').length;
    const inProgressIssues = issues.filter(issue => issue.status === 'IN_PROGRESS').length;
    const todoIssues = issues.filter(issue => issue.status === 'TODO').length;
    const completionRate = totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0;

    setAnalytics({
      totalIssues,
      completedIssues,
      inProgressIssues,
      todoIssues,
      completionRate,
      aiInsights: ''
    });
  };

  const generateAIInsights = async () => {
    if (!sprintData) return;

    setInsightsLoading(true);
    try {
      const statusDistribution = {
        TODO: analytics?.todoIssues || 0,
        IN_PROGRESS: analytics?.inProgressIssues || 0,
        DONE: analytics?.completedIssues || 0
      };

      const response = await fetch('/api/ai/analyze-sprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sprintData: {
            ...sprintData,
            statusDistribution
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI insights');
      }

      const data = await response.json();
      setAnalytics(prev => prev ? { ...prev, aiInsights: data.analysis } : null);
      toast.success('AI insights generated successfully!');
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast.error('Failed to generate AI insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'todo': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getCompletionBadge = (rate: number) => {
    if (rate >= 80) return { color: 'bg-green-100 text-green-800 border-green-300', text: 'Excellent' };
    if (rate >= 60) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', text: 'Good' };
    if (rate >= 40) return { color: 'bg-orange-100 text-orange-800 border-orange-300', text: 'Needs Attention' };
    return { color: 'bg-red-100 text-red-800 border-red-300', text: 'Critical' };
  };

  if (!analytics) {
    return (
      <div className={`${className} flex items-center justify-center p-8`}>
        <div className="spinner" />
      </div>
    );
  }

  const completionBadge = getCompletionBadge(analytics.completionRate);

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-enhanced">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalIssues}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-enhanced">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.completedIssues}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-enhanced">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.inProgressIssues}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-enhanced">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.completionRate.toFixed(1)}%
                    </p>
                    <Badge className={`${completionBadge.color} text-xs`}>
                      {completionBadge.text}
                    </Badge>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-6"
      >
        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Sprint Progress</h3>
              <span className="text-sm text-gray-600">
                {analytics.completedIssues} of {analytics.totalIssues} issues completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analytics.completionRate}%` }}
                transition={{ delay: 0.7, duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.aiInsights ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-sm max-w-none"
              >
                <p className="text-gray-700 whitespace-pre-wrap">{analytics.aiInsights}</p>
              </motion.div>
            ) : (
              <div className="text-center py-6">
                <Button
                  onClick={generateAIInsights}
                  disabled={insightsLoading}
                  className="ai-button"
                >
                  {insightsLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  {insightsLoading ? 'Analyzing...' : 'Generate AI Insights'}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Get AI-powered insights about your sprint performance
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AISprintAnalytics; 