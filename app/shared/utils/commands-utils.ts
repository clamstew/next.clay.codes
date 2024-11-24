export const getMatchingCommands = (command: string, allCommands: string[]) => {
  console.log("command", command);
  console.log("allCommands", allCommands);
  if (!command) return [];

  // Create a sanitized search string
  const sanitizedCommand = command.toLowerCase().replace(/[^a-z0-9]/gi, ""); // Remove all non-alphanumeric characters

  // Create a regex that looks for the sanitized command anywhere in the string
  const regex = new RegExp(sanitizedCommand, "i"); // 'i' flag for case-insensitive

  return allCommands.filter((cmd) => regex.test(cmd));
};
