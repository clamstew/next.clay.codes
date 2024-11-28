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
