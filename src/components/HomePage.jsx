import React from "react";
import { t } from "../i18n-simple";
import { PATHS } from "../paths";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>{t("Accueil")}</h1>
        <p>{t("Bienvenue dans votre gestionnaire de tâches !")}</p>
        
        <div className="home-actions">
          <Link to={PATHS.TODOS.href} className="home-link primary">
            {t("Voir les tâches")}
          </Link>
          <Link to={PATHS.ARCHIVES.href} className="home-link secondary">
            {t("Tâches archivées")}
          </Link>
        </div>
      </div>
    </div>
  );
}

