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
    "Supprimer": "Supprimer",
    "Accueil": "Accueil",
    "Tâches": "Tâches",
    "Tâches archivées": "Tâches archivées",
    "Page non trouvée": "Page non trouvée",
    "Désolé, la page que vous recherchez n'existe pas.": "Désolé, la page que vous recherchez n'existe pas.",
    "Retourner à l'accueil": "Retourner à l'accueil",
    "Cette page affichera les tâches archivées.": "Cette page affichera les tâches archivées.",
    "Fonctionnalité à implémenter...": "Fonctionnalité à implémenter...",
    "Sélectionner la langue": "Sélectionner la langue",
    "Archiver": "Archiver",
    "Archiver la tâche": "Archiver la tâche",
    "Restaurer": "Restaurer",
    "Restaurer la tâche": "Restaurer la tâche",
    "Supprimer définitivement": "Supprimer définitivement",
    "Complétée": "Complétée",
    "Archivée le": "Archivée le",
    "Aucune tâche archivée": "Aucune tâche archivée",
    "tâche(s) archivée(s)": "tâche(s) archivée(s)",
    "Vos tâches archivées apparaîtront ici": "Vos tâches archivées apparaîtront ici",
    "Bienvenue dans votre gestionnaire de tâches !": "Bienvenue dans votre gestionnaire de tâches !",
    "Voir les tâches": "Voir les tâches"
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
    "Supprimer": "Delete",
    "Accueil": "Home",
    "Tâches": "Tasks",
    "Tâches archivées": "Archived Tasks",
    "Page non trouvée": "Page not found",
    "Désolé, la page que vous recherchez n'existe pas.": "Sorry, the page you are looking for does not exist.",
    "Retourner à l'accueil": "Return to home",
    "Cette page affichera les tâches archivées.": "This page will display archived tasks.",
    "Fonctionnalité à implémenter...": "Feature to be implemented...",
    "Sélectionner la langue": "Select language",
    "Archiver": "Archive",
    "Archiver la tâche": "Archive task",
    "Restaurer": "Restore",
    "Restaurer la tâche": "Restore task",
    "Supprimer définitivement": "Permanently delete",
    "Complétée": "Completed",
    "Archivée le": "Archived on",
    "Aucune tâche archivée": "No archived tasks",
    "tâche(s) archivée(s)": "archived task(s)",
    "Vos tâches archivées apparaîtront ici": "Your archived tasks will appear here",
    "Bienvenue dans votre gestionnaire de tâches !": "Welcome to your task manager!",
    "Voir les tâches": "View tasks"
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
