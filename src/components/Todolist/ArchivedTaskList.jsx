import React, { useMemo } from "react";
import { useTodoContext } from "../../contexts/TodoContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../i18n-simple";

/**
 * Composant de formatage de date pour les tâches archivées
 * Utilise la locale actuelle pour formater la date
 */
function FormatArchivedDate({ timestamp }) {
  const { currentLocale } = useLanguage();
  
  const formattedDate = useMemo(() => {
    const date = new Date(timestamp);
    const locale = currentLocale === 'en' ? 'en-US' : 'fr-FR';
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [timestamp, currentLocale]);

  return (
    <span className="archived-date">
      📅 {t("Archivée le")} {formattedDate}
    </span>
  );
}

/**
 * Badge affichant le statut de complétion d'une tâche
 */
function CompletedBadge() {
  return (
    <span className="archived-badge completed">
      {t("Complétée")}
    </span>
  );
}

/**
 * Composant pour les boutons d'action des tâches archivées
 */
function ArchivedItemActions({ todoId, onRestore, onDelete }) {
  return (
    <div className="archived-actions">
      <button
        className="archived-btn restore-btn"
        onClick={() => onRestore(todoId)}
        aria-label={t("Restaurer la tâche")}
        title={t("Restaurer")}
      >
        🔄 {t("Restaurer")}
      </button>
      <button
        className="archived-btn delete-btn"
        onClick={() => onDelete(todoId)}
        aria-label={t("Supprimer définitivement")}
        title={t("Supprimer")}
      >
        🗑️ {t("Supprimer")}
      </button>
    </div>
  );
}

/**
 * Composant représentant une tâche archivée individuelle
 */
function ArchivedTaskItem({ todo }) {
  const { actions } = useTodoContext();

  return (
    <li className="archived-item">
      <div className="archived-content">
        <div className="archived-text-wrapper">
          <p className="archived-text">{todo.text}</p>
          {todo.completed && <CompletedBadge />}
          <FormatArchivedDate timestamp={todo.archivedAt} />
        </div>
      </div>
      
      <ArchivedItemActions 
        todoId={todo.id}
        onRestore={actions.restoreTodo}
        onDelete={actions.deleteArchived}
      />
    </li>
  );
}

/**
 * État vide lorsque aucune tâche n'est archivée
 */
function EmptyArchiveState() {
  return (
    <div className="empty-archived">
      <div className="empty-archived-icon">📦</div>
      <p className="empty-archived-text">
        {t("Vos tâches archivées apparaîtront ici")}
      </p>
    </div>
  );
}

/**
 * Composant principal affichant la liste des tâches archivées
 */
export default function ArchivedTaskList() {
  const { selectors } = useTodoContext();
  const archivedTodos = selectors.getArchivedTodos();

  return (
    <div className="archived-task-list">
      <div className="archived-header">
        <h2>{t("Tâches archivées")}</h2>
        <p className="archived-subtitle">
          {archivedTodos.length === 0 
            ? t("Aucune tâche archivée")
            : `${archivedTodos.length} ${t("tâche(s) archivée(s)")}`
          }
        </p>
      </div>

      {archivedTodos.length === 0 ? (
        <EmptyArchiveState />
      ) : (
        <ul className="archived-todos-list">
          {archivedTodos.map((todo) => (
            <ArchivedTaskItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
}
