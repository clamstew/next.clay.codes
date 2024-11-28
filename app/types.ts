export interface CommandHistoryItem {
  command: string;
  output: string;
  error: string;
}

export interface Command {
  command: string;
  title: string;
  description: string;
  url?: string;
  subCommands?: SubCommand[];
  output?: string;
  error?: string;
}

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
