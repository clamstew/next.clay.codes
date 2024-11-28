import type { Command } from "~/types";

export const goSiteCommands: Record<string, Command> = {
  github: {
    command: "github",
    title: "GitHub Profile",
    description: "View my open source contributions and projects",
    url: "https://github.com/clamstew",
  },
  "hire me": {
    command: "hire me",
    title: "LinkedIn Profile",
    description: "View my professional experience and contact info",
    url: "https://www.linkedin.com/in/claystewart/",
  },
  x: {
    command: "x",
    title: "X/Twitter Profile",
    description: "Follow me on X (formerly Twitter)",
    url: "https://x.com/Clay_Stewart",
  },
  bsky: {
    command: "bsky",
    title: "Bluesky Profile",
    description: "Follow me on Bluesky",
    url: "https://bsky.app/profile/clay.codes",
  },
  asdf: {
    command: "asdf",
    title: "ASDF Version Manager",
    description: "Tool version manager that I maintain",
    url: "https://github.com/asdf-vm/asdf",
  },
  "site code": {
    command: "site code",
    title: "Website Source",
    description: "View the source code for this website",
    url: "https://github.com/clamstew/next.clay.codes",
  },
  notes: {
    command: "notes",
    title: "Notes App",
    description: "My notes application",
    url: "https://notes.build",
  },
  insulin: {
    command: "insulin",
    title: "Insulin Calculator",
    description: "Calculate insulin needs based on food intake",
    url: "https://fat-protein.netlify.app",
  },
  shop: {
    command: "shop",
    title: "Online Shop",
    description: "My online store",
    url: "https://claycraftscode.myshopify.com",
  },
};

export const terminalCommands: Record<string, Command> = {
  history: {
    command: "history",
    title: "Command History",
    description: "Show previously executed commands",
  },
  fullscreen: {
    command: "fullscreen",
    title: "Fullscreen Mode",
    description: "Enter fullscreen mode",
  },
  minimize: {
    command: "minimize",
    title: "Minimize",
    description: "Exit fullscreen mode",
  },
  terminal: {
    command: "terminal",
    title: "Terminal Mode",
    description: "Enter terminal mode with fullscreen",
  },
  clear: {
    command: "clear",
    title: "Clear Screen",
    description: "Clear the terminal screen",
  },
  exit: {
    command: "exit",
    title: "Exit",
    description: "Exit terminal mode",
  },
  compgen: {
    command: "compgen",
    title: "List Commands",
    description: "Show all available commands",
  },
  help: {
    command: "help",
    title: "Help",
    description: "Show help information for commands",
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
