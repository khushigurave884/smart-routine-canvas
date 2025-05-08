
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import TaskExport from "@/components/TaskExport";
import MotivationalQuote from "@/components/MotivationalQuote";
import { LanguageProvider } from "@/context/LanguageContext";
import { TaskProvider } from "@/context/TaskContext";
import { useLanguage } from "@/context/LanguageContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

const BreakSuggestion: React.FC = () => {
  const { content } = useLanguage();
  const [showBreak, setShowBreak] = useState(false);
  
  // Show break suggestion every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBreak(true);
      setTimeout(() => setShowBreak(false), 30000); // Hide after 30 seconds
    }, 1800000); // 30 minutes
    
    // For demo purposes, show it after 15 seconds initially
    const initialTimer = setTimeout(() => {
      setShowBreak(true);
      setTimeout(() => setShowBreak(false), 30000);
    }, 15000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);
  
  if (!showBreak) return null;
  
  return (
    <Alert className="bg-accent/20 border-accent mb-4 animate-fade-in">
      <Clock className="h-4 w-4" />
      <AlertTitle>{content.timeToBreak}</AlertTitle>
      <AlertDescription>{content.breakSuggestion}</AlertDescription>
    </Alert>
  );
};

const IndexContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <MotivationalQuote />
          <BreakSuggestion />
          <TaskInput />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-3">Tasks</h2>
              <TaskList />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Actions</h2>
              <div className="space-y-4">
                <TaskExport />
                {/* Additional actions could go here */}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <LanguageProvider>
      <TaskProvider>
        <IndexContent />
      </TaskProvider>
    </LanguageProvider>
  );
};

export default Index;
