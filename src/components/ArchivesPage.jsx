import React from "react";
import { t } from "../i18n-simple";
import ArchivedTaskList from "./Todolist/ArchivedTaskList";

export default function ArchivesPage() {
  return (
    <div className="archives-page">
      <div className="archives-content">
        <ArchivedTaskList />
      </div>
    </div>
  );
}
