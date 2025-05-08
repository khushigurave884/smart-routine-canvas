
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage } from "@/lib/types";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, content } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };

  return (
    <div className="flex items-center">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={content.switchLanguage} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{content.languages.en}</SelectItem>
          <SelectItem value="es">{content.languages.es}</SelectItem>
          <SelectItem value="hi">{content.languages.hi}</SelectItem>
          <SelectItem value="fr">{content.languages.fr}</SelectItem>
          <SelectItem value="de">{content.languages.de}</SelectItem>
          <SelectItem value="zh">{content.languages.zh}</SelectItem>
          <SelectItem value="ja">{content.languages.ja}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
