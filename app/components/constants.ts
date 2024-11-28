import type { Command } from "~/types";

export const goSiteCommands: Record<string, Command> = {
  github: {
    command: "github",
    title: "GitHub Profile",
    description: "View my open source contributions and projects",
    url: "https://github.com/clamstew",
    emoji: "🐙",
    tags: ["github", "open source"],
  },
  "hire me": {
    command: "hire me",
    title: "LinkedIn Profile",
    description: "View my professional experience and contact info",
    url: "https://www.linkedin.com/in/claystewart/",
    emoji: "💼",
    tags: ["linkedin", "professional"],
  },
  x: {
    command: "x",
    title: "X/Twitter Profile",
    description: "Follow me on X (formerly Twitter)",
    url: "https://x.com/Clay_Stewart",
    emoji: "🐦",
    tags: ["x", "twitter"],
  },
  bsky: {
    command: "bsky",
    title: "Bluesky Profile",
    description: "Follow me on Bluesky",
    url: "https://bsky.app/profile/clay.codes",
    emoji: "☁️",
    tags: ["bluesky"],
  },
  asdf: {
    command: "asdf",
    title: "ASDF Version Manager",
    description: "Tool version manager that I maintain",
    url: "https://github.com/asdf-vm/asdf",
    emoji: "🔧",
    tags: ["asdf", "version manager"],
  },
  "site code": {
    command: "site code",
    title: "Website Source",
    description: "View the source code for this website",
    url: "https://github.com/clamstew/next.clay.codes",
    emoji: "💻",
    tags: ["github", "open source"],
  },
  notes: {
    command: "notes",
    title: "Notes App",
    description: "My notes application",
    url: "https://notes.build",
    emoji: "📝",
    tags: ["notes"],
  },
  insulin: {
    command: "insulin",
    title: "Insulin Calculator",
    description: "Calculate insulin needs based on food intake",
    url: "https://fat-protein.netlify.app",
    emoji: "💉",
    tags: ["insulin", "calculator", "health", "tools", "entertainment"],
  },
  shop: {
    command: "shop",
    title: "Online Shop",
    description: "My online store",
    url: "https://claycraftscode.myshopify.com",
    emoji: "🛍️",
    tags: ["shop"],
  },
};

export const terminalCommands: Record<string, Command> = {
  history: {
    command: "history",
    title: "Command History",
    description: "Show previously executed commands",
    emoji: "📜",
    tags: ["terminal", "history"],
  },
  fullscreen: {
    command: "fullscreen",
    title: "Fullscreen Mode",
    description: "Enter fullscreen mode",
    emoji: "🔍",
    tags: ["terminal", "fullscreen"],
  },
  minimize: {
    command: "minimize",
    title: "Minimize",
    description: "Exit fullscreen mode",
    emoji: "⬇️",
    tags: ["terminal", "fullscreen"],
  },
  terminal: {
    command: "terminal",
    title: "Terminal Mode",
    description: "Enter terminal mode with fullscreen",
    emoji: "🖥️",
    tags: ["terminal", "fullscreen"],
  },
  clear: {
    command: "clear",
    title: "Clear Screen",
    description: "Clear the terminal screen",
    emoji: "🧹",
    tags: ["terminal", "reset", "exit"],
  },
  exit: {
    command: "exit",
    title: "Exit",
    description: "Exit terminal mode",
    emoji: "🚪",
    tags: ["terminal", "reset", "exit"],
  },
  compgen: {
    command: "compgen",
    title: "List Commands",
    description: "Show all available commands",
    emoji: "📋",
    tags: ["terminal", "list"],
  },
  help: {
    command: "help",
    title: "Help",
    description: "Show help information for commands",
    emoji: "❓",
    tags: ["terminal", "help"],
  },
};

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
