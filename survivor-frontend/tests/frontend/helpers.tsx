import messages from "../../src/locales/en/messages";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

i18n.load({ en: messages });
i18n.activate("en");
export const ReactTestingLibraryProvider = (props: any) => {
  return <I18nProvider i18n={i18n}>{props.children}</I18nProvider>;
};
