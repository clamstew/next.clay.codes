import type { Command } from "~/types";

export const getMatchingCommands = (
  command: Command["command"],
  allCommands: Command[]
) => {
  if (!command) return [];

  const regex = new RegExp(command.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""));

  return allCommands.filter((cmd) => cmd.command.match(regex));
};
