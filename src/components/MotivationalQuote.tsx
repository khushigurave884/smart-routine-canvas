
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

// Sample quotes for demonstration
const quotes = [
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "The only way to do great work is to love what you do.",
  "Quality is not an act, it is a habit.",
  "You are never too old to set another goal or to dream a new dream.",
];

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState("");
  const { language } = useLanguage();

  // Change quote every 60 seconds or when language changes
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    const interval = setInterval(() => {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(newQuote);
    }, 60000);

    return () => clearInterval(interval);
  }, [language]);

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none shadow-none">
      <CardContent className="p-4 text-center">
        <p className="italic text-lg">"{quote}"</p>
        <CardDescription className="mt-2">Time to focus and achieve your goals!</CardDescription>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuote;
