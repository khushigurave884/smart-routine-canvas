
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
  const { content } = useLanguage();

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-white font-bold">ST</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {content.appName}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
