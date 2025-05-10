
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
import { jsPDF } from "jspdf";
import { format } from "date-fns";

const TaskExport: React.FC = () => {
  const { tasks } = useTask();
  const { content } = useLanguage();
  const [exporting, setExporting] = useState(false);

  const generatePDFContent = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Task Export", pageWidth/2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Exported on ${format(new Date(), "PPP")}`, pageWidth/2, 30, { align: "center" });
    
    // Add tasks
    let yPosition = 40;
    doc.setFontSize(14);
    
    tasks.forEach((task, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add task details
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${task.content}`, 20, yPosition);
      yPosition += 7;
      
      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      
      doc.text(`Status: ${task.completed ? "Completed" : "Pending"}`, 25, yPosition);
      yPosition += 5;
      
      doc.text(`Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`, 25, yPosition);
      yPosition += 5;
      
      doc.text(`Category: ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}`, 25, yPosition);
      yPosition += 5;
      
      if (task.deadline) {
        doc.text(`Deadline: ${format(new Date(task.deadline), "PPP")}`, 25, yPosition);
        yPosition += 5;
      }
      
      // Add space between tasks
      yPosition += 5;
      doc.setFontSize(14);
    });
    
    return doc;
  };

  const exportToPDF = () => {
    if (tasks.length === 0) {
      toast.error("No tasks to export!");
      return;
    }
    
    setExporting(true);
    try {
      const doc = generatePDFContent();
      doc.save("tasks.pdf");
      toast.success("Tasks exported to PDF successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    if (tasks.length === 0) {
      toast.error("No tasks to export!");
      return;
    }
    
    setExporting(true);
    try {
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
      toast.success("Tasks exported to JSON successfully!");
    } catch (error) {
      console.error("Error exporting to JSON:", error);
      toast.error("Failed to export JSON. Please try again.");
    } finally {
      setExporting(false);
    }
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
