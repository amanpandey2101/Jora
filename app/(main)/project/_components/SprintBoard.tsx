"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SprintManager from "./SprintManager";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./CreateIssues";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
// import { issue } from "@uiw/react-md-editor";
import IssueCard from "./IssueCard";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issue";
import { toast } from "sonner";
import BoardFilters from "./BoardFilters";

function SprintBoard({ sprints = [], projectId, orgId }: any) {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr: any) => spr?.status === "ACTIVE") || sprints[0] || null
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

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
  const handleFilterChange = (newFilteredIssues:any) => {
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

  

  return (
    <div className="">
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )}

      {issuesLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      {/* Kanban board */}

     
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 bg-[#867c45]  uppercase p-4 text-white mx-10 rounded-lg mb-36 ">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>
                  <hr />
                  {/* issues */}
                  {filteredIssues?.filter((issue: any) => issue.status === column.key)
                    .map((issue: any, index: any) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
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
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  {column.key === "TODO" && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => handleAddIssue(column.key)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Issue
                    </Button>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint?.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
}

export default SprintBoard;
