
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, Priority, Category } from "@/lib/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface TaskContextType {
  tasks: Task[];
  addTask: (content: string, priority?: Priority, category?: Category, deadline?: Date | null) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  syncTaskWithCalendar: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on init
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          deadline: task.deadline ? new Date(task.deadline) : null
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error("Failed to parse saved tasks:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (
    content: string,
    priority: Priority = "medium",
    category: Category = "work",
    deadline: Date | null = null
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      content,
      completed: false,
      deadline,
      priority,
      category,
      syncedWithCalendar: false
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    toast.success("Task updated successfully!");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Mock function for syncing with Google Calendar
  const syncTaskWithCalendar = async (id: string) => {
    // In a real app, this would call an API to sync with Google Calendar
    // For now, we'll just simulate a delay and update the sync status
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, syncedWithCalendar: true } : task
          )
        );
        toast.success("Task synced with Google Calendar!");
        resolve();
      }, 1500);
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        syncTaskWithCalendar
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
