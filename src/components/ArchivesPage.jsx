import React from "react";
import { t } from "../i18n-simple";

export default function ArchivesPage() {
  return (
    <div className="archives-page">
      <div className="archives-content">
        <h1 className="archives-title">{t("Tâches archivées")}</h1>
        <p className="archives-message">
          {t("Cette page affichera les tâches archivées.")}
        </p>
        <div className="archives-placeholder">
          <p>{t("Fonctionnalité à implémenter...")}</p>
        </div>
      </div>
    </div>
  );
}
