export interface CommandHistoryItem {
  command: string;
  output: string;
  error: string;
  timestamp: number;
  isFullscreenTerminal: boolean;
  historyIndex: number;
  rawCommand: Command | undefined; // undefined if command is not found in allCommands
}

export type CommandType = "webpage-shortcut" | "terminal";

export type Command = {
  command: string;
  title: string;
  description: string;
  url?: string;
  subCommands?: SubCommand[];
  // output, error can likely be removed
  // makes sense to use CommandHistoryItem.output instead
  // output?: string;
  // error?: string;
  emoji?: string;
  tags?: string[];
  type: CommandType;
  status?:
    | "active"
    | "inactive"
    | "coming-soon"
    | "listed"
    | "unlisted"
    | "hidden-in-hiring-mode";
};

interface SubCommand {
  command: string;
  title: string;
  description: string;
}

export enum EventKeyName {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  Escape = "Escape",
  Enter = "Enter",
  Tab = "Tab",
}

export enum SpecialCommandOutputTokens {
  ShowCommandList = "::show-command-list::",
  ShowHelpList = "::show-help-list::",
}
