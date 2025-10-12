import React, { createContext, useContext, useState } from 'react';
import { setLocale, getCurrentLocale } from '../i18n-simple';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());
  const [forceUpdate, setForceUpdate] = useState(0);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);
    // Sauvegarder le choix dans localStorage
    localStorage.setItem('todo-app-locale', newLocale);
    // Force le re-rendu de toute l'application
    setForceUpdate(prev => prev + 1);
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLocale, 
      changeLanguage, 
      forceUpdate 
    }}>
      <div key={`lang-${currentLocale}-${forceUpdate}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
