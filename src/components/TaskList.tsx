
import React from "react";
import { useTask } from "@/context/TaskContext";
import { useLanguage } from "@/context/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { format } from "date-fns";
import { CalendarIcon, Calendar, ListCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CalendarStatus from "./CalendarStatus";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-priority-high text-white";
    case "medium":
      return "bg-priority-medium text-white";
    case "low":
      return "bg-priority-low text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const TaskList: React.FC = () => {
  const { tasks, toggleTaskCompletion, deleteTask, syncTaskWithCalendar } = useTask();
  const { content } = useLanguage();

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ListCheck className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{content.emptyTaskList}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          syncWithCalendar={syncTaskWithCalendar}
          content={content}
        />
      ))}
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  syncWithCalendar: (id: string) => Promise<void>;
  content: any;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  toggleCompletion,
  deleteTask,
  syncWithCalendar,
  content,
}) => {
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncWithCalendar(task.id);
    setSyncing(false);
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      task.completed && "opacity-60"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleCompletion(task.id)}
              className="mt-1"
            />
            <div>
              <CardTitle className={cn(task.completed && "line-through text-muted-foreground")}>
                {task.content}
              </CardTitle>
              {task.deadline && (
                <CardDescription className="flex items-center mt-1">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {format(task.deadline, "PPP")}
                </CardDescription>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <Badge className={getPriorityColor(task.priority)}>
              {content.priorities[task.priority]}
            </Badge>
            <Badge variant="outline">
              {content.categories[task.category]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="pt-0 flex justify-between">
        <CalendarStatus 
          synced={task.syncedWithCalendar}
          onSync={handleSync}
          syncing={syncing}
          content={content}
        />
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => deleteTask(task.id)}
        >
          {content.delete || "Delete"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskList;
