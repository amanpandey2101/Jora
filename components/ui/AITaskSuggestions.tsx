'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Sparkles, Plus, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedHours: number;
}

interface AITaskSuggestionsProps {
  projectDescription: string;
  existingTasks: string[];
  onTaskSelect: (task: TaskSuggestion) => void;
  className?: string;
}

const priorityColors = {
  HIGH: 'bg-red-100 text-red-800 border-red-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  LOW: 'bg-green-100 text-green-800 border-green-300',
};

const AITaskSuggestions: React.FC<AITaskSuggestionsProps> = ({
  projectDescription,
  existingTasks,
  onTaskSelect,
  className
}) => {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateSuggestions = async () => {
    if (!projectDescription) {
      toast.error('Project description is required for AI suggestions');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDescription,
          existingTasks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setIsOpen(true);
      toast.success('AI suggestions generated successfully!');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelect = (task: TaskSuggestion) => {
    onTaskSelect(task);
    toast.success(`Task "${task.title}" added to your project!`);
  };

  return (
    <div className={className}>
      <Button
        onClick={generateSuggestions}
        disabled={loading}
        className="ai-button mb-4"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 mr-2" />
        )}
        {loading ? 'Generating...' : 'AI Task Suggestions'}
      </Button>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                AI Generated Suggestions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card className="card-enhanced card-hover h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium leading-tight">
                          {task.title}
                        </CardTitle>
                        <Badge
                          className={`ml-2 ${priorityColors[task.priority]} text-xs`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.estimatedHours}h
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          AI Generated
                        </div>
                      </div>

                      <Button
                        onClick={() => handleTaskSelect(task)}
                        size="sm"
                        className="w-full btn-primary text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Task
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Button
                onClick={generateSuggestions}
                variant="outline"
                size="sm"
                disabled={loading}
                className="smooth-hover"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate More Suggestions
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITaskSuggestions; 