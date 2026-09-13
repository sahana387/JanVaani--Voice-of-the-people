import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  userRole: 'citizen' | 'admin';
  setUserRole: (role: 'citizen' | 'admin') => void;
  selectedWardNumber: number;
  setSelectedWardNumber: (ward: number) => void;
  selectedWardName: string;
  setSelectedWardName: (name: string) => void;
  userInterests: string[];
  setUserInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  sessionToken: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('janvaani_lang') as Language) || 'en';
  });
  const [userRole, setUserRole] = useState<'citizen' | 'admin'>('citizen');
  const [selectedWardNumber, setSelectedWardNumber] = useState<number>(80);
  const [selectedWardName, setSelectedWardName] = useState<string>('Indiranagar');
  const [userInterests, setUserInterests] = useState<string[]>([
    'Zoning & Planning', 'Transport & Mobility', 'Environment & Waste'
  ]);
  const [sessionToken] = useState<string>(() => {
    let token = localStorage.getItem('janvaani_session');
    if (!token) {
      token = 'session_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('janvaani_session', token);
    }
    return token;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('janvaani_lang', lang);
  };

  const toggleInterest = (interest: string) => {
    setUserInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userRole,
        setUserRole,
        selectedWardNumber,
        setSelectedWardNumber,
        selectedWardName,
        setSelectedWardName,
        userInterests,
        setUserInterests,
        toggleInterest,
        sessionToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
