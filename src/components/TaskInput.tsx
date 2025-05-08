
import React, { useState, useRef } from "react";
import { useTask } from "@/context/TaskContext";
import { useLanguage } from "@/context/LanguageContext";
import { Category, Priority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

const TaskInput: React.FC = () => {
  const { addTask } = useTask();
  const { content } = useLanguage();
  const [taskContent, setTaskContent] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // In a real app, this would use the Web Speech API
  const toggleVoiceInput = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      toast.info("Voice recording started. Speak now...");
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        setTaskContent((prev) => 
          prev + (prev ? " " : "") + "Voice recorded task example"
        );
        setIsRecording(false);
        toast.success("Voice input captured!");
      }, 3000);
    } else {
      // Stop recording
      setIsRecording(false);
      toast.info("Voice recording stopped");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskContent.trim()) {
      toast.error("Task content cannot be empty!");
      return;
    }
    addTask(taskContent.trim(), priority, category, deadline);
    setTaskContent("");
    setPriority("medium");
    setCategory("work");
    setDeadline(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={content.taskPlaceholder}
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleVoiceInput}
          className={isRecording ? "bg-red-100 border-red-300" : ""}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">{content.priority}</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
            <SelectTrigger id="priority">
              <SelectValue placeholder={content.noPrioritySet} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{content.priorities.low}</SelectItem>
              <SelectItem value="medium">{content.priorities.medium}</SelectItem>
              <SelectItem value="high">{content.priorities.high}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{content.category}</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
            <SelectTrigger id="category">
              <SelectValue placeholder={content.noCategorySet} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">{content.categories.work}</SelectItem>
              <SelectItem value="personal">{content.categories.personal}</SelectItem>
              <SelectItem value="health">{content.categories.health}</SelectItem>
              <SelectItem value="finance">{content.categories.finance}</SelectItem>
              <SelectItem value="education">{content.categories.education}</SelectItem>
              <SelectItem value="social">{content.categories.social}</SelectItem>
              <SelectItem value="other">{content.categories.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">{content.deadline}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="deadline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !deadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "PPP") : content.noDeadlineSet}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {content.addTask}
      </Button>
    </form>
  );
};

export default TaskInput;
