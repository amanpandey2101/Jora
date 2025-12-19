"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import SprintManager from "./SprintManager";
import AISprintAnalytics from "@/components/ui/AISprintAnalytics";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, Brain, Eye, EyeOff } from "lucide-react";
import IssueCreationDrawer from "./CreateIssues";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
// import { issue } from "@uiw/react-md-editor";
import IssueCard from "./IssueCard";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issue";
import { toast } from "sonner";
import BoardFilters from "./BoardFilters";

function SprintBoard({ sprints = [], projectId, orgId, projectName, projectDescription }: any) {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr: any) => spr?.status === "ACTIVE") || sprints[0] || null
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  function reorder(list: any, startIndex: any, endIndex: any) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  const handleAddIssue = (status: any) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const {
    loading: issuesLoading,
    // error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  }: any = useFetch(getIssuesForSprint);

  const [filteredIssues, setFilteredIssues] = useState(issues);
  const handleFilterChange = (newFilteredIssues: any) => {
    setFilteredIssues(newFilteredIssues);
  };


  console.log("issues: ", issues);

  useEffect(() => {
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint.id]);

  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
  };

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    // error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const onDragEnd = async (result: any) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...issues];

    // source and destination list
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );

      reorderedCards.forEach((card: any, i) => {
        card.order = i;
      });
    } else {
      // remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId;

      // add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues: any[] = newOrderedData.sort(
      (a, b) => a.order - b.order
    );
    setIssues(newOrderedData, sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };

  const getColumnStats = (status: string) => {
    const columnIssues = filteredIssues?.filter((issue: any) => issue.status === status) || [];
    return {
      count: columnIssues.length,
      urgentCount: columnIssues.filter((issue: any) => issue.priority === 'URGENT').length,
      highCount: columnIssues.filter((issue: any) => issue.priority === 'HIGH').length,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'IN_REVIEW': return 'bg-yellow-500';
      case 'DONE': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {/* Analytics Toggle */}
      <motion.div 
        className="flex justify-end mb-4 mx-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={() => setShowAnalytics(!showAnalytics)}
          variant="outline"
          className="smooth-hover"
        >
          {showAnalytics ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Analytics
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Show AI Analytics
            </>
          )}
        </Button>
      </motion.div>

      {/* AI Analytics Section */}
      <AnimatePresence>
        {showAnalytics && currentSprint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-10 mb-6"
          >
            <AISprintAnalytics 
              sprintData={{
                ...currentSprint,
                issues: issues || []
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {issues && !issuesLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
        </motion.div>
      )}

      {issuesLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <BarLoader width={"100%"} color="#36d7b7" />
        </motion.div>
      )}

      {/* Enhanced Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 p-6 mx-10 rounded-2xl mb-36 glass-card">
            {statuses.map((column, columnIndex) => {
              const stats = getColumnStats(column.key);
              
              return (
                <motion.div
                  key={column.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * columnIndex, duration: 0.4 }}
                >
                  <Droppable droppableId={column.key}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`
                          space-y-3 p-4 rounded-xl min-h-96 transition-all duration-300
                          ${snapshot.isDraggingOver ? 'bg-primary/10 border-2 border-primary/30' : 'bg-card/50 dark:bg-card/30 border border-border'}
                          shadow-lg hover:shadow-xl backdrop-blur-sm
                        `}
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(column.key)}`} />
                            <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                              {column.name}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant="secondary" className="text-xs">
                              {stats.count}
                            </Badge>
                            {stats.urgentCount > 0 && (
                              <Badge className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-xs">
                                 {stats.urgentCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                        {/* Issues */}
                        <div className="space-y-3">
                          {filteredIssues?.filter((issue: any) => issue.status === column.key)
                            .map((issue: any, index: any) => (
                              <Draggable
                                key={issue.id}
                                draggableId={issue.id}
                                index={index}
                                isDragDisabled={updateIssuesLoading}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`
                                      ${snapshot.isDragging ? 'rotate-3 scale-105' : ''}
                                      transition-all duration-200
                                    `}
                                  >
                                    <motion.div
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <IssueCard
                                        issue={issue}
                                        onDelete={() => fetchIssues(currentSprint.id)}
                                        onUpdate={(updated: any) =>
                                          setIssues((issues: any) =>
                                            issues.map((issue: any) => {
                                              if (issue.id === updated.id) return updated;
                                              return issue;
                                            })
                                          )
                                        }
                                      />
                                    </motion.div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        </div>

                        {provided.placeholder}

                  
                        {column.key === "TODO" && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="ghost"
                              className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 h-20 rounded-xl"
                              onClick={() => handleAddIssue(column.key)}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <Plus className="h-6 w-6 text-gray-400" />
                                <span className="text-sm text-gray-600">Create Issue</span>
                              </div>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              );
            })}
          </div>
        </DragDropContext>
      </motion.div>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint?.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
        projectName={projectName}
        projectDescription={projectDescription}
      />
    </motion.div>
  );
}

export default SprintBoard;
