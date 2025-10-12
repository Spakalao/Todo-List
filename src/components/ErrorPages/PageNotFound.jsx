import React from "react";
import { Link } from "react-router-dom";
import { t } from "../../i18n-simple";
import { PATHS } from "../../paths";

export default function PageNotFound() {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">404</h1>
        <h2 className="error-subtitle">{t("Page non trouvée")}</h2>
        <p className="error-message">
          {t("Désolé, la page que vous recherchez n'existe pas.")}
        </p>
        <Link to={PATHS.TODOS.href} className="error-link">
          {t("Retourner à l'accueil")}
        </Link>
      </div>
    </div>
  );
}
