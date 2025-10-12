import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { TodoProvider } from './contexts/TodoContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/Header'
import TodoList from './components/Todolist/TodoList'
import ArchivesPage from './components/ArchivesPage'
import PageNotFound from './components/ErrorPages/PageNotFound'
import { PATHS } from './paths'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <TodoProvider>
        <div className="app">
          <Header />
          
          <main className="app-main">
            <Routes>
              <Route path={PATHS.TODOS.href} element={<TodoList />} />
              <Route path={PATHS.ARCHIVES.href} element={<ArchivesPage />} />
              {/* Redirection de la racine vers /todos */}
              <Route path="/" element={<Navigate to={PATHS.TODOS.href} replace />} />
              {/* Route 404 - doit être en dernière position */}
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </main>
        </div>
      </TodoProvider>
    </LanguageProvider>
  )
}

export default App
