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
  toggleTheme: "Toggle theme",
  languages: {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    zh: "Chinese",
    ja: "Japanese",
    hi: "Hindi"
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
  toggleTheme: "Cambiar tema",
  languages: {
    en: "Inglés",
    es: "Español",
    fr: "Francés",
    de: "Alemán",
    zh: "Chino",
    ja: "Japonés",
    hi: "Hindi"
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

// Add Hindi language content
const hindiContent: LanguageContent = {
  appName: "दैनिक कार्य से स्मार्ट नोट्स कनवर्टर",
  addTask: "नया कार्य जोड़ें",
  taskPlaceholder: "आपको क्या करने की आवश्यकता है?",
  startVoiceInput: "आवाज़ इनपुट शुरू करें",
  stopVoiceInput: "आवाज़ इनपुट बंद करें",
  priority: "प्राथमिकता",
  category: "श्रेणी",
  deadline: "समय सीमा",
  noPrioritySet: "कोई प्राथमिकता नहीं",
  noCategorySet: "कोई श्रेणी नहीं",
  noDeadlineSet: "कोई समय सीमा नहीं",
  export: "निर्यात करें",
  exportToPDF: "PDF में निर्यात करें",
  exportToJSON: "JSON में निर्यात करें",
  syncWithCalendar: "कैलेंडर से सिंक करें",
  synced: "सिंक्रनाइज�� किया गया",
  notSynced: "सिंक्रनाइज़ नहीं किया गया",
  breakSuggestion: "ब्रेक का समय! 5 मिनट की वॉक लें।",
  switchLanguage: "भाषा बदलें",
  emptyTaskList: "अभी तक कोई कार्य नहीं है। शुरू करने के लिए कुछ कार्य जोड़ें!",
  timeToBreak: "ब्रेक लेने का समय है!",
  toggleTheme: "थीम बदलें",
  languages: {
    en: "अंग्रेज़ी",
    es: "स्पैनिश",
    fr: "फ्रेंच",
    de: "जर्मन",
    zh: "चीनी",
    ja: "जापानी",
    hi: "हिंदी"
  },
  priorities: {
    low: "कम",
    medium: "मध्यम",
    high: "उच्च"
  },
  categories: {
    work: "कार्य",
    personal: "व्यक्तिगत",
    health: "स्वास्थ्य",
    finance: "वित्त",
    education: "शिक्षा",
    social: "सामाजिक",
    other: "अन्य"
  }
};

// Basic language content dictionary
const languageContents: Record<SupportedLanguage, LanguageContent> = {
  en: englishContent,
  es: spanishContent,
  fr: englishContent, // Would be replaced with actual French content
  de: englishContent, // Would be replaced with actual German content
  zh: englishContent, // Would be replaced with actual Chinese content
  ja: englishContent, // Would be replaced with actual Japanese content
  hi: hindiContent
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
