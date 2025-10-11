// Version simplifiée de l'internationalisation pour Node.js v12
const messages = {
  fr: {
    "Ma Todo List": "Ma Todo List",
    "Ajouter": "Ajouter",
    "Ajoutez votre première tâche ci-dessus": "Ajoutez votre première tâche ci-dessus",
    "Aucune tâche": "Aucune tâche",
    "Chargement...": "Chargement...",
    "Langue:": "Langue:",
    "tâches terminées": "tâches terminées",
    "restantes": "restantes",
    "Ajouter une tâche...": "Ajouter une tâche...",
    "Marquer comme terminée": "Marquer comme terminée",
    "Marquer comme non terminée": "Marquer comme non terminée",
    "Éditer la tâche": "Éditer la tâche",
    "Supprimer la tâche": "Supprimer la tâche",
    "Supprimer": "Supprimer"
  },
  en: {
    "Ma Todo List": "My Todo List",
    "Ajouter": "Add",
    "Ajoutez votre première tâche ci-dessus": "Add your first task above",
    "Aucune tâche": "No tasks",
    "Chargement...": "Loading...",
    "Langue:": "Language:",
    "tâches terminées": "tasks completed",
    "restantes": "remaining",
    "Ajouter une tâche...": "Add a task...",
    "Marquer comme terminée": "Mark as completed",
    "Marquer comme non terminée": "Mark as incomplete",
    "Éditer la tâche": "Edit task",
    "Supprimer la tâche": "Delete task",
    "Supprimer": "Delete"
  }
};

let currentLocale = 'fr';

export const setLocale = (locale) => {
  currentLocale = locale;
};

export const t = (key) => {
  return messages[currentLocale][key] || key;
};

export const getCurrentLocale = () => currentLocale;
