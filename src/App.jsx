import React, { useState } from 'react'
import { setLocale, t, getCurrentLocale } from './i18n-simple'
import { TodoProvider } from './contexts/TodoContext'
import TodoList from './components/Todolist/TodoList'
import './App.css'

function App() {
  const [currentLocale, setCurrentLocale] = useState('fr')

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale)
    setCurrentLocale(newLocale)
  }

  return (
    <TodoProvider>
      <div className="app">
        <div className="language-selector">
          <span>{t('Langue:')}</span>
          <select 
            value={currentLocale} 
            onChange={(e) => handleLocaleChange(e.target.value)}
          >
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>
        
        <TodoList />
      </div>
    </TodoProvider>
  )
}

export default App
