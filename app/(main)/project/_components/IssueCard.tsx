"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/ui/UserAvatar";
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./IssueDetailsDialog";
import { 
  AlertTriangle, 
  Flag, 
  User,
  Calendar,
  Zap,
  Circle,
  CircleDot,
  Timer,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const priorityConfig: any = {
  LOW: { 
    border: "border-green-500", 
    text: "text-green-700", 
    bg: "bg-green-50 dark:bg-green-950/30",
    icon: Circle,
    iconColor: "text-green-500",
    color: "green"
  },
  MEDIUM: { 
    border: "border-yellow-500", 
    text: "text-yellow-700 dark:text-yellow-400", 
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    icon: CircleDot,
    iconColor: "text-yellow-500",
    color: "yellow"
  },
  HIGH: { 
    border: "border-orange-500", 
    text: "text-orange-700 dark:text-orange-400", 
    bg: "bg-orange-50 dark:bg-orange-950/30",
    icon: AlertCircle,
    iconColor: "text-orange-500",
    color: "orange"
  },
  URGENT: { 
    border: "border-red-500", 
    text: "text-red-700 dark:text-red-400", 
    bg: "bg-red-50 dark:bg-red-950/30",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    color: "red"
  },
};

const statusConfig: any = {
  TODO: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", icon: Timer },
  IN_PROGRESS: { bg: "bg-blue-100 dark:bg-blue-900/50", text: "text-blue-700 dark:text-blue-400", icon: Zap },
  IN_REVIEW: { bg: "bg-yellow-100 dark:bg-yellow-900/50", text: "text-yellow-700 dark:text-yellow-400", icon: Eye },
  DONE: { bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-700 dark:text-green-400", icon: CheckCircle2 },
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  const router = useRouter();

  const onDeleteHandler = (...params: any) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params: any) => {
    router.refresh();
    onUpdate(...params);
  };

  const priority = priorityConfig[issue.priority];
  const status = statusConfig[issue.status];

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          className={`
            cursor-pointer transition-all duration-300 group relative overflow-hidden
            ${isHovered ? 'shadow-lg ring-2 ring-blue-200' : 'shadow-md hover:shadow-lg'}
            ${priority.bg} border-l-4 ${priority.border}
          `}
          onClick={() => setIsDialogOpen(true)}
        >
          {/* Priority indicator icon */}
          <div className="absolute top-2 right-2">
            <motion.div
              animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
              className={priority.iconColor}
            >
              <priority.icon className="h-4 w-4" />
            </motion.div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2 pr-8 leading-tight">
                {issue.title}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="py-2">
            <div className="flex items-center gap-2 mb-3">
              {showStatus && (
                <Badge 
                  className={`${status.bg} ${status.text} border-0 text-xs font-medium`}
                >
                  <status.icon className="h-3 w-3 mr-1" />
                  {issue.status.replace('_', ' ')}
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className={`${priority.text} ${priority.border} text-xs font-medium`}
              >
                <Flag className="h-3 w-3 mr-1" />
                {issue.priority}
              </Badge>
            </div>

            {/* Description preview */}
            {issue.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {issue.description.replace(/[#*`]/g, '').substring(0, 80)}
                {issue.description.length > 80 && '...'}
              </p>
            )}
          </CardContent>

          <CardFooter className="pt-2 pb-4">
            <div className="flex items-center justify-between w-full">
              {/* Assignee */}
              <div className="flex items-center">
                {issue.assignee ? (
                  <div className="flex items-center space-x-2">
                    <UserAvatar user={issue.assignee} />
                    <span className="text-xs text-gray-600 font-medium">
                      {issue.assignee.name?.split(' ')[0]}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-gray-400">
                    <User className="h-3 w-3 mr-1" />
                    Unassigned
                  </div>
                )}
              </div>

              {/* Created date */}
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {created}
              </div>
            </div>
          </CardFooter>

          {/* Hover effect overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 pointer-events-none"
            animate={{ opacity: isHovered ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Priority pulse effect for urgent items */}
          {issue.priority === 'URGENT' && (
            <motion.div
              className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Card>
      </motion.div>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={`${priority.border} ${priority.text}`}
        />
      )}
    </>
  );
}
