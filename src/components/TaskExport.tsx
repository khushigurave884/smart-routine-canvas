
import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ListCheck, Download } from "lucide-react";

const TaskExport: React.FC = () => {
  const { tasks } = useTask();
  const { content } = useLanguage();
  const [exporting, setExporting] = useState(false);

  const exportToPDF = () => {
    setExporting(true);
    // In a real app, this would generate a PDF file
    setTimeout(() => {
      toast.success("Tasks exported to PDF successfully!");
      setExporting(false);
      
      // Simulate download
      const element = document.createElement("a");
      const file = new Blob(
        [JSON.stringify(tasks, null, 2)],
        { type: "application/json" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "tasks.pdf";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  const exportToJSON = () => {
    setExporting(true);
    setTimeout(() => {
      toast.success("Tasks exported to JSON successfully!");
      setExporting(false);
      
      // Create download
      const element = document.createElement("a");
      const file = new Blob(
        [JSON.stringify(tasks, null, 2)],
        { type: "application/json" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "tasks.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={tasks.length === 0 || exporting}>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          disabled={tasks.length === 0 || exporting}
        >
          {exporting ? (
            <span className="animate-pulse">Exporting...</span>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>{content.export}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToPDF}>
          {content.exportToPDF}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          {content.exportToJSON}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskExport;
