import React, { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  language: string;
  content: any;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Define content based on language
  const content = {
    en: {
      appName: "Daily Task to Smart Notes Converter",
      headerSlogan: "Organize your tasks, amplify your productivity.",
      taskPlaceholder: "Write your task here...",
      priority: "Priority",
      category: "Category",
      deadline: "Deadline",
      addTask: "Add Task",
      noPrioritySet: "No Priority Set",
      noCategorySet: "No Category Set",
      noDeadlineSet: "No Deadline Set",
      emptyTaskList: "Your task list is empty. Add a task to get started!",
      export: "Export",
      exportToPDF: "Export to PDF",
      exportToJSON: "Export to JSON",
      delete: "Delete",
      timeToBreak: "Time for a Break!",
      breakSuggestion: "Take a 5-minute walk to refresh your mind.",
      startVoiceInput: "Start speaking...",
      stopVoiceInput: "Stop speaking...",
      categories: {
        work: "Work",
        personal: "Personal",
        health: "Health",
        finance: "Finance",
        education: "Education",
        social: "Social",
        other: "Other",
      },
      priorities: {
        low: "Low",
        medium: "Medium",
        high: "High",
      },
      calendarStatus: {
        synced: "Synced",
        notSynced: "Not Synced",
        sync: "Sync",
        syncing: "Syncing..."
      },
      useAI: "Use AI",
      aiPriority: "AI Priority",
      analyzing: "Analyzing...",
    },
    es: {
      appName: "Convertidor de Tareas Diarias a Notas Inteligentes",
      headerSlogan: "Organiza tus tareas, amplifica tu productividad.",
      taskPlaceholder: "Escribe tu tarea aquí...",
      priority: "Prioridad",
      category: "Categoría",
      deadline: "Fecha límite",
      addTask: "Agregar Tarea",
      noPrioritySet: "Sin Prioridad Establecida",
      noCategorySet: "Sin Categoría Establecida",
      noDeadlineSet: "Sin Fecha Límite Establecida",
      emptyTaskList: "Tu lista de tareas está vacía. ¡Agrega una tarea para comenzar!",
      export: "Exportar",
      exportToPDF: "Exportar a PDF",
      exportToJSON: "Exportar a JSON",
      delete: "Eliminar",
      timeToBreak: "¡Hora de un Descanso!",
      breakSuggestion: "Da un paseo de 5 minutos para refrescar tu mente.",
      startVoiceInput: "Empieza a hablar...",
      stopVoiceInput: "Deja de hablar...",
      categories: {
        work: "Trabajo",
        personal: "Personal",
        health: "Salud",
        finance: "Finanzas",
        education: "Educación",
        social: "Social",
        other: "Otro",
      },
      priorities: {
        low: "Baja",
        medium: "Media",
        high: "Alta",
      },
      calendarStatus: {
        synced: "Sincronizado",
        notSynced: "No Sincronizado",
        sync: "Sincronizar",
        syncing: "Sincronizando..."
      },
      useAI: "Usar IA",
      aiPriority: "Prioridad IA",
      analyzing: "Analizando...",
    },
    hi: {
      appName: "दैनिक कार्य से स्मार्ट नोट्स कन्वर्टर",
      headerSlogan: "अपने कार्यों को व्यवस्थित करें, अपनी उत्पादकता बढ़ाएँ।",
      taskPlaceholder: "अपना कार्य यहाँ लिखें...",
      priority: "प्राथमिकता",
      category: "श्रेणी",
      deadline: "अंतिम तिथि",
      addTask: "कार्य जोड़ें",
      noPrioritySet: "कोई प्राथमिकता निर्धारित नहीं है",
      noCategorySet: "कोई श्रेणी निर्धारित नहीं है",
      noDeadlineSet: "कोई अंतिम तिथि निर्धारित नहीं है",
      emptyTaskList: "आपकी कार्य सूची खाली है। आरंभ करने के लिए एक कार्य जोड़ें!",
      export: "निर्यात",
      exportToPDF: "पीडीएफ में निर्यात करें",
      exportToJSON: "जे JSON में निर्यात करें",
      delete: "हटाएं",
      timeToBreak: "ब्रेक का समय!",
      breakSuggestion: "अपने मन को ताज़ा करने के लिए 5 मिनट की पैदल चलें।",
      startVoiceInput: "बोलना शुरू करें...",
      stopVoiceInput: "बोलना बंद करें...",
       categories: {
        work: "काम",
        personal: "निजी",
        health: "स्वास्थ्य",
        finance: "वित्त",
        education: "शिक्षा",
        social: "सामाजिक",
        other: "अन्य",
      },
      priorities: {
        low: "निम्न",
        medium: "मध्यम",
        high: "उच्च",
      },
      calendarStatus: {
        synced: "सिंक किया गया",
        notSynced: "सिंक नहीं किया गया",
        sync: "सिंक",
        syncing: "सिंक कर रहा है..."
      },
      useAI: "AI का उपयोग करें",
      aiPriority: "AI प्राथमिकता",
      analyzing: "विश्लेषण हो रहा है...",
    }
  };

  return (
    <LanguageContext.Provider value={{ language, content, setLanguage }}>
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
