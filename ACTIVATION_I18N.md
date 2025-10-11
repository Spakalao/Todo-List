# 🌍 Activation de l'internationalisation

## Prérequis
- Node.js installé et fonctionnel
- Commandes `node --version` et `npm --version` qui fonctionnent

## Étapes d'activation

### 1. Installer les dépendances Lingui
```bash
npm install @lingui/react @lingui/core @lingui/cli
npm install -D @lingui/babel-plugin-lingui-macro @lingui/vite-plugin
```

### 2. Activer les imports dans main.jsx
Remplacez le contenu de `src/main.jsx` par :
```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { i18n, I18nProvider, activate } from "./i18n";

activate("fr");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </StrictMode>,
);
```

### 3. Activer les imports dans App.jsx
Remplacez le contenu de `src/App.jsx` par :
```javascript
import React, { useState } from 'react'
import { Trans } from '@lingui/react'
import { useLingui } from '@lingui/react'
import { activate } from './i18n'
import { TodoProvider } from './contexts/TodoContext'
import TodoList from './components/Todolist/TodoList'
import './App.css'

function App() {
  const { i18n } = useLingui()
  const [currentLocale, setCurrentLocale] = useState('fr')

  const handleLocaleChange = async (newLocale) => {
    await activate(newLocale)
    setCurrentLocale(newLocale)
  }

  return (
    <TodoProvider>
      <div className="app">
        <div className="language-selector">
          <span><Trans>Langue:</Trans></span>
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
```

### 4. Activer les imports dans les composants

**Dans `src/components/Todolist/TodoList.jsx` :**
```javascript
import React from "react";
import { Trans } from "@lingui/react";
import { useTodoContext } from "../../contexts/TodoContext";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
```

Et remplacer les textes par :
```javascript
<h1><Trans>Ma Todo List</Trans></h1>
<div className="todo-stats">
  <Trans>
    {stats.completed} / {stats.total} tâches terminées • {stats.active} restantes
  </Trans>
</div>
<div className="empty-state-text"><Trans>Aucune tâche</Trans></div>
<div className="empty-state-subtext"><Trans>Ajoutez votre première tâche ci-dessus</Trans></div>
```

**Dans `src/components/Todolist/TodoForm.jsx` :**
```javascript
import React, { useState } from "react";
import { Trans } from "@lingui/react";
import { useTodoContext } from "../../contexts/TodoContext";
```

Et remplacer les textes par :
```javascript
<button type="submit" disabled={!inputText.trim()}>
  <Trans>Ajouter</Trans>
</button>
<div className="loading"><Trans>Chargement...</Trans></div>
```

### 5. Décommenter les traductions
Dans `src/locales/fr/messages.po` et `src/locales/en/messages.po`, décommenter toutes les lignes qui commencent par `#~` :

**Remplacez :**
```
#~ msgid "Ma Todo List"
#~ msgstr "Ma Todo List"
```

**Par :**
```
msgid "Ma Todo List"
msgstr "Ma Todo List"
```

### 6. Extraire et compiler les traductions
```bash
npm run extract
npm run compile
```

### 7. Lancer l'application
```bash
npm run dev
```

## Résultat attendu
- ✅ Interface en français par défaut
- ✅ Sélecteur de langue fonctionnel
- ✅ Changement français ↔ anglais en temps réel
- ✅ Tous les textes traduits

## En cas de problème
1. Vérifiez que Node.js est installé
2. Vérifiez que les dépendances sont installées
3. Regardez la console du navigateur pour les erreurs
4. Vérifiez que les fichiers `.po` sont décommentés

