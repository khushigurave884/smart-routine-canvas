
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const Footer: React.FC = () => {
  const { content } = useLanguage();

  return (
    <footer className="border-t mt-auto py-4 bg-background">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {content.appName}</p>
      </div>
    </footer>
  );
};

export default Footer;
