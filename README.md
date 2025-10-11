# TodoList React avec Internationalisation

Une application de gestion de tâches moderne développée avec React, utilisant l'API Context, useReducer, et l'internationalisation avec Lingui.

## 🚀 Fonctionnalités

### ✅ Gestion des tâches
- **Ajouter** de nouvelles tâches
- **Marquer comme terminées** avec des checkboxes
- **Éditer en ligne** (double-clic sur le texte)
- **Supprimer** des tâches
- **Statistiques** en temps réel

### 🌍 Internationalisation
- **Français** (langue par défaut)
- **Anglais**
- **Changement de langue** en temps réel
- **Interface complètement traduite**

### 🎨 Interface moderne
- **Design responsive** (mobile, tablette, desktop)
- **Animations fluides** et transitions
- **Thème cohérent** avec variables CSS
- **Accessibilité** (ARIA labels, navigation clavier)

### 🔌 Intégration API
- **API DummyJSON** pour les données de test
- **Gestion des états** de chargement et d'erreur
- **Mise à jour optimiste** des données
- **Rollback automatique** en cas d'erreur

## 🏗️ Architecture

### Structure des fichiers
```
src/
├── assets/           # Images et ressources
├── components/       # Composants React
│   └── Todolist/
│       ├── TodoList.jsx    # Conteneur principal
│       ├── TodoItem.jsx    # Élément de tâche
│       └── TodoForm.jsx    # Formulaire d'ajout
├── contexts/         # Context API
│   └── TodoContext.jsx     # Contexte global
├── hooks/           # Hooks personnalisés
│   └── useTodoApi.js       # Gestion API
├── reducers/        # Reducers
│   └── TodoReducer.js      # Logique d'état
├── locales/         # Traductions
│   ├── fr/          # Français
│   └── en/          # Anglais
├── App.jsx          # Composant racine
├── App.css          # Styles principaux
├── i18n.js          # Configuration i18n
└── main.jsx         # Point d'entrée
```

### Technologies utilisées
- **React 19** - Framework UI
- **Vite** - Bundler et serveur de développement
- **Context API** - Gestion d'état globale
- **useReducer** - Gestion d'état complexe
- **Lingui** - Internationalisation
- **CSS Variables** - Thème cohérent
- **Fetch API** - Appels HTTP

## 🛠️ Installation et utilisation

### Prérequis
- Node.js >= 22.x.x
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd todo-list

# Installer les dépendances
npm install

# Installer les dépendances Lingui
npm install @lingui/react @lingui/core @lingui/cli
npm install -D @lingui/babel-plugin-lingui-macro @lingui/vite-plugin
```

### Développement
```bash
# Lancer le serveur de développement
npm run dev

# Extraire les traductions
npm run extract

# Compiler les traductions
npm run compile
```

### Production
```bash
# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 🎯 Objectifs pédagogiques atteints

- ✅ **Composants React** organisés en arborescence
- ✅ **JSX** pour décrire l'interface utilisateur
- ✅ **Hooks principaux** (useState, useEffect, useContext, useReducer)
- ✅ **Interrogation d'API externe** avec gestion d'erreurs
- ✅ **États de chargement et d'erreur** gérés proprement
- ✅ **Interactions clavier** pour l'accessibilité
- ✅ **Internationalisation** complète avec Lingui

## 🎨 Design et UX

### Principes appliqués
- **Hiérarchie visuelle claire** avec titres et zones distinctes
- **Cohérence graphique** (couleurs, typographies, espacements)
- **Alignement harmonieux** des éléments
- **Responsive design** pour toutes les tailles d'écran

### Accessibilité
- **ARIA labels** sur les éléments interactifs
- **Navigation clavier** (Tab, Enter, Escape)
- **Focus visible** pour la navigation
- **Contraste de couleurs** respecté
- **Structure sémantique** HTML

## 🌐 Internationalisation

### Langues supportées
- **Français** (source) - `fr`
- **Anglais** - `en`

### Workflow de traduction
1. Ajouter du texte avec `<Trans>Votre texte</Trans>`
2. Exécuter `npm run extract` pour mettre à jour les catalogues
3. Traduire dans `src/locales/en/messages.po`
4. Exécuter `npm run compile` pour compiler

### Composants Lingui utilisés
- `<Trans>` - Traduction simple
- `useLingui()` - Hook pour la gestion des locales
- `activate()` - Fonction de changement de langue

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 480px
- **Tablette** : 481px - 768px
- **Desktop** : > 768px

### Adaptations
- **Mobile** : Formulaire en colonne, éléments empilés
- **Tablette** : Layout hybride
- **Desktop** : Layout horizontal optimisé

## 🔧 API Integration

### Endpoints utilisés
- `GET /todos?limit=10` - Récupérer les tâches
- `POST /todos/add` - Ajouter une tâche
- `PUT /todos/:id` - Modifier une tâche
- `DELETE /todos/:id` - Supprimer une tâche

### Gestion des erreurs
- **404** : Ignoré pour les tâches locales
- **Autres erreurs** : Affichées à l'utilisateur
- **Rollback** : Retour à l'état précédent en cas d'erreur

## 🚀 Déploiement

L'application peut être déployée sur :
- **Vercel** (recommandé)
- **Netlify**
- **GitHub Pages**
- **Serveur statique** classique

## 📝 Licence

Ce projet est développé dans le cadre d'un TP pédagogique.