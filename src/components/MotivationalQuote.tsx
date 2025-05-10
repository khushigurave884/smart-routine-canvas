
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/api/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch quote");
        }
        
        const data = await response.json();
        setQuote(data.quote);
      } catch (error) {
        console.error("Error fetching quote:", error);
        // Fallback to default quotes if API fails
        const fallbackQuotes = [
          "The secret of getting ahead is getting started.",
          "Don't watch the clock; do what it does. Keep going.",
          "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        ];
        setQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]);
        toast.error("Failed to fetch AI quote, using fallback quote");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();

    const interval = setInterval(() => {
      fetchQuote();
    }, 60000);

    return () => clearInterval(interval);
  }, [language]);

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none shadow-none">
      <CardContent className="p-4 text-center">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <p className="italic text-lg">"{quote}"</p>
            <CardDescription className="mt-2">Time to focus and achieve your goals!</CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MotivationalQuote;
