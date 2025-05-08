
import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageContent, SupportedLanguage } from "@/lib/types";

// English language content as the default
const englishContent: LanguageContent = {
  appName: "Daily Task to Smart Notes Converter",
  addTask: "Add a new task",
  taskPlaceholder: "What do you need to do?",
  startVoiceInput: "Start voice input",
  stopVoiceInput: "Stop voice input",
  priority: "Priority",
  category: "Category",
  deadline: "Deadline",
  noPrioritySet: "No priority",
  noCategorySet: "No category",
  noDeadlineSet: "No deadline",
  export: "Export",
  exportToPDF: "Export to PDF",
  exportToJSON: "Export to JSON",
  syncWithCalendar: "Sync with Calendar",
  synced: "Synced",
  notSynced: "Not synced",
  breakSuggestion: "Time for a break! Take a 5-minute walk.",
  switchLanguage: "Switch language",
  emptyTaskList: "No tasks yet. Add some tasks to get started!",
  timeToBreak: "Time to take a break!",
  languages: {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    zh: "Chinese",
    ja: "Japanese"
  },
  priorities: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  categories: {
    work: "Work",
    personal: "Personal",
    health: "Health",
    finance: "Finance",
    education: "Education",
    social: "Social",
    other: "Other"
  }
};

// Mock-up for Spanish language content
const spanishContent: LanguageContent = {
  appName: "Convertidor de Tareas Diarias a Notas Inteligentes",
  addTask: "Añadir una nueva tarea",
  taskPlaceholder: "¿Qué necesitas hacer?",
  startVoiceInput: "Iniciar entrada de voz",
  stopVoiceInput: "Detener entrada de voz",
  priority: "Prioridad",
  category: "Categoría",
  deadline: "Fecha límite",
  noPrioritySet: "Sin prioridad",
  noCategorySet: "Sin categoría",
  noDeadlineSet: "Sin fecha límite",
  export: "Exportar",
  exportToPDF: "Exportar a PDF",
  exportToJSON: "Exportar a JSON",
  syncWithCalendar: "Sincronizar con Calendario",
  synced: "Sincronizado",
  notSynced: "No sincronizado",
  breakSuggestion: "¡Hora de un descanso! Da un paseo de 5 minutos.",
  switchLanguage: "Cambiar idioma",
  emptyTaskList: "No hay tareas todavía. ¡Añade algunas para empezar!",
  timeToBreak: "¡Es hora de tomar un descanso!",
  languages: {
    en: "Inglés",
    es: "Español",
    fr: "Francés",
    de: "Alemán",
    zh: "Chino",
    ja: "Japonés"
  },
  priorities: {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  },
  categories: {
    work: "Trabajo",
    personal: "Personal",
    health: "Salud",
    finance: "Finanzas",
    education: "Educación",
    social: "Social",
    other: "Otro"
  }
};

// Basic language content dictionary
const languageContents: Record<SupportedLanguage, LanguageContent> = {
  en: englishContent,
  es: spanishContent,
  fr: englishContent, // Would be replaced with actual French content
  de: englishContent, // Would be replaced with actual German content
  zh: englishContent, // Would be replaced with actual Chinese content
  ja: englishContent  // Would be replaced with actual Japanese content
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  content: LanguageContent;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [content, setContent] = useState<LanguageContent>(languageContents[language]);

  useEffect(() => {
    // Update content when language changes
    setContent(languageContents[language]);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
