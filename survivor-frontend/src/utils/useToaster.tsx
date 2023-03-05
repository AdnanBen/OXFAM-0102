import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useToaster } from "rsuite";
import { ToastContainerProps } from "rsuite/esm/toaster/ToastContainer";

export default () => {
  const originalUseToaster = useToaster();
  return {
    ...originalUseToaster,
    push: (node: React.ReactNode, options?: ToastContainerProps) =>
      originalUseToaster.push(
        <I18nProvider i18n={i18n}>{node}</I18nProvider>,
        options
      ),
  };
};
