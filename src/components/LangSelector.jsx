import React from 'react';
import { t } from '../i18n-simple';
import { useLanguage } from '../contexts/LanguageContext';

export default function LangSelector() {
  const { currentLocale, changeLanguage } = useLanguage();

  const handleLocaleChange = (newLocale) => {
    changeLanguage(newLocale);
  };

  return (
    <div className="language-selector">
      <span>{t('Langue:')}</span>
      <select 
        value={currentLocale} 
        onChange={(e) => handleLocaleChange(e.target.value)}
        aria-label={t('Sélectionner la langue')}
      >
        <option value="fr">🇫🇷 Français</option>
        <option value="en">🇺🇸 English</option>
      </select>
    </div>
  );
}
