import { terminalCommands } from "~/db/commands/terminal-commands";
import { goSiteCommands } from "~/db/commands/open-site-commands";

// Helper to extract just the command strings for backwards compatibility
export const allCommands = [
  ...Object.values(goSiteCommands),
  ...Object.values(terminalCommands),
];

// Helper to get URLs from go site commands
export const goSiteToCommands = Object.fromEntries(
  Object.values(goSiteCommands)
    .map((cmd) => [cmd.command, cmd.url])
    .filter(([, url]) => Boolean(url))
);

export const isDev = process.env.NODE_ENV === "development";
