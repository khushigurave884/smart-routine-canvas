
export type Priority = "low" | "medium" | "high";

export type Category = 
  | "work" 
  | "personal" 
  | "health" 
  | "finance" 
  | "education" 
  | "social" 
  | "other";

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  deadline: Date | null;
  priority: Priority;
  category: Category;
  syncedWithCalendar: boolean;
}

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "zh" | "ja";

export interface LanguageContent {
  appName: string;
  addTask: string;
  taskPlaceholder: string;
  startVoiceInput: string;
  stopVoiceInput: string;
  priority: string;
  category: string;
  deadline: string;
  noPrioritySet: string;
  noCategorySet: string;
  noDeadlineSet: string;
  export: string;
  exportToPDF: string;
  exportToJSON: string;
  syncWithCalendar: string;
  synced: string;
  notSynced: string;
  breakSuggestion: string;
  switchLanguage: string;
  emptyTaskList: string;
  timeToBreak: string;
  languages: {
    en: string;
    es: string;
    fr: string;
    de: string;
    zh: string;
    ja: string;
  };
  priorities: {
    low: string;
    medium: string;
    high: string;
  };
  categories: {
    work: string;
    personal: string;
    health: string;
    finance: string;
    education: string;
    social: string;
    other: string;
  };
}
