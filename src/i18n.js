import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

// Active une locale et charge les messages
export async function activate(locale) {
  const { messages } = await import(`./locales/${locale}/messages.js`);

  i18n.load(locale, messages);
  i18n.activate(locale);
}

export { i18n, I18nProvider };

