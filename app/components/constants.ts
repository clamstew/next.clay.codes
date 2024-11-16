export const goSiteToCommands = {
  x: "https://x.com/Clay_Stewart",
  github: "https://github.com/clamstew",
  "hire me": "https://www.linkedin.com/in/claystewart/",
  // "box it up": "https://www.mybox.es",
  // asdf: "https://github.com/asdf-vm/asdf",
  "site code": "https://github.com/clamstew/next.clay.codes",
  notes: "https://notes.build",
};

export const terminalCommands = {
  history: "history",
};

export const allCommands = [
  ...Object.keys(goSiteToCommands),
  ...Object.keys(terminalCommands),
];
