
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
import { Clock, Loader2 } from "lucide-react";

const BreakSuggestion: React.FC = () => {
  const { content, language } = useLanguage();
  const [showBreak, setShowBreak] = useState(false);
  const [suggestion, setSuggestion] = useState<string>(content.breakSuggestion);
  const [loading, setLoading] = useState(false);
  
  const fetchBreakSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/break-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestion(data.suggestion);
      } else {
        // Fallback to default suggestion
        setSuggestion(content.breakSuggestion);
      }
    } catch (error) {
      console.error("Error fetching break suggestion:", error);
      setSuggestion(content.breakSuggestion);
    } finally {
      setLoading(false);
    }
  };
  
  // Show break suggestion every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBreak(true);
      fetchBreakSuggestion();
      setTimeout(() => setShowBreak(false), 30000); // Hide after 30 seconds
    }, 1800000); // 30 minutes
    
    // For demo purposes, show it after 15 seconds initially
    const initialTimer = setTimeout(() => {
      setShowBreak(true);
      fetchBreakSuggestion();
      setTimeout(() => setShowBreak(false), 30000);
    }, 15000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [language]);
  
  if (!showBreak) return null;
  
  return (
    <Alert className="bg-accent/20 border-accent mb-4 animate-fade-in">
      <Clock className="h-4 w-4" />
      <AlertTitle>{content.timeToBreak}</AlertTitle>
      <AlertDescription>
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading suggestion...</span>
          </div>
        ) : (
          suggestion
        )}
      </AlertDescription>
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
