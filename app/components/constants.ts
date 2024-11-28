export const goSiteToCommands = {
  github: "https://github.com/clamstew",
  "hire me": "https://www.linkedin.com/in/claystewart/",
  x: "https://x.com/Clay_Stewart",
  bsky: "https://bsky.app/profile/clay.codes",
  // "box it up": "https://www.mybox.es",
  asdf: "https://github.com/asdf-vm/asdf",
  "site code": "https://github.com/clamstew/next.clay.codes",
  notes: "https://notes.build",
  insulin: "https://fat-protein.netlify.app",
  shop: "https://claycraftscode.myshopify.com",
};

export const terminalCommands = {
  history: "history",
  fullscreen: "fullscreen",
  minimize: "minimize",
  terminal: "terminal",
  clear: "clear",
  exit: "exit",
  compgen: "compgen",
  help: "help",
};

export const allCommands = [
  ...Object.keys(goSiteToCommands),
  ...Object.keys(terminalCommands),
];
