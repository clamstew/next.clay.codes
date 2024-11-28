export interface CommandHistoryItem {
  command: string;
  output: string;
  error: string;
  timestamp: number;
  isFullscreenTerminal: boolean;
  historyIndex: number;
  rawCommand: Command | undefined; // undefined if command is not found in allCommands
}

export type Command = {
  command: string;
  title: string;
  description: string;
  url?: string;
  subCommands?: SubCommand[];
  output?: string;
  error?: string;
  emoji?: string;
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
