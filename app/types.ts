export interface CommandHistoryItem {
  command: string;
  output: string;
  error: string;
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
