import { useTranslation } from "react-i18next";
import { Command } from "~/types";

export function useCommandTranslation() {
  const { t } = useTranslation("common");

  const translateCommand = (command: Command) => {
    return {
      ...command,
      title: t(`commands.${command.command}.title`, command.title),
      description: t(
        `commands.${command.command}.description`,
        command.description
      ),
    };
  };

  return { translateCommand };
}
