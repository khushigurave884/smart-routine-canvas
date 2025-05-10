import React, { useState, useRef, useEffect } from "react";
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
import { CalendarIcon, Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  start(): void;
  stop(): void;
}

// Define the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

const TaskInput: React.FC = () => {
  const { addTask } = useTask();
  const { content, language } = useLanguage();
  const [taskContent, setTaskContent] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzingPriority, setIsAnalyzingPriority] = useState(false);
  const [priorityExplanation, setPriorityExplanation] = useState<string | null>(null);
  const [useAIPriority, setUseAIPriority] = useState(true);
  
  // Reference to Speech Recognition API
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Set language based on current app language
      const speechLanguage = language === 'es' ? 'es-ES' : 
                            language === 'hi' ? 'hi-IN' : 'en-US';
      recognitionRef.current.lang = speechLanguage;
      
      // Set up event handlers
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        setTaskContent(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast.error("Voice input error: " + event.error);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    // Clean up
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        if (isRecording) {
          recognitionRef.current.stop();
        }
      }
    };
  }, [language]);

  // Update language when app language changes
  useEffect(() => {
    if (recognitionRef.current) {
      const speechLanguage = language === 'es' ? 'es-ES' : 
                            language === 'hi' ? 'hi-IN' : 'en-US';
      recognitionRef.current.lang = speechLanguage;
    }
  }, [language]);

  // Determine priority using AI when task content changes
  useEffect(() => {
    // Only attempt to determine priority if:
    // 1. Task content is not empty
    // 2. AI priority is enabled
    // 3. Not already analyzing priority
    if (taskContent.trim() && useAIPriority && !isAnalyzingPriority) {
      const determinePriority = async () => {
        // Debounce - only analyze after user stops typing for 1 second
        const timeoutId = setTimeout(async () => {
          setIsAnalyzingPriority(true);
          try {
            const response = await fetch("http://127.0.0.1:5000/api/determine-priority", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                taskContent,
                language 
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              setPriority(data.priority as Priority);
              setPriorityExplanation(data.explanation || null);
            } else {
              console.error("Error determining priority:", await response.text());
              setPriorityExplanation(null);
            }
          } catch (error) {
            console.error("Error determining priority:", error);
            setPriorityExplanation(null);
          } finally {
            setIsAnalyzingPriority(false);
          }
        }, 1000); // 1-second debounce
        
        return () => clearTimeout(timeoutId);
      };
      
      determinePriority();
    } else if (!taskContent.trim()) {
      // Reset explanation when task content is empty
      setPriorityExplanation(null);
    }
  }, [taskContent, language, useAIPriority]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (!isRecording) {
      // Start recording
      recognitionRef.current.start();
      setIsRecording(true);
      toast.info(content.startVoiceInput);
    } else {
      // Stop recording
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.info(content.stopVoiceInput);
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
    setPriorityExplanation(null);
    setCategory("work");
    setDeadline(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-background rounded-lg shadow-sm border border-border">
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
          className={isRecording ? "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700" : ""}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="priority">{content.priority}</Label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="use-ai-priority"
                checked={useAIPriority}
                onChange={(e) => setUseAIPriority(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="use-ai-priority" className="text-xs text-muted-foreground">
                {content.useAI || "Use AI"}
              </label>
            </div>
          </div>
          <Select 
            value={priority} 
            onValueChange={(value) => setPriority(value as Priority)}
            disabled={useAIPriority && isAnalyzingPriority}
          >
            <SelectTrigger id="priority" className="relative">
              {isAnalyzingPriority && useAIPriority && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              <SelectValue placeholder={content.noPrioritySet} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{content.priorities.low}</SelectItem>
              <SelectItem value="medium">{content.priorities.medium}</SelectItem>
              <SelectItem value="high">{content.priorities.high}</SelectItem>
            </SelectContent>
          </Select>
          {priorityExplanation && (
            <p className="text-xs text-muted-foreground mt-1">{priorityExplanation}</p>
          )}
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

// Add SpeechRecognition types for TypeScript
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default TaskInput;
