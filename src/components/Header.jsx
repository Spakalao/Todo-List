import React from 'react';
import LangSelector from './LangSelector';
import Navbar from './Navbar';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="app-title">Todo List</h1>
        <div className="header-controls">
          <Navbar />
          <LangSelector />
        </div>
      </div>
    </header>
  );
}
