export const getMatchingCommands = (command: string, allCommands: string[]) => {
  if (!command) return [];
  const regex = new RegExp(
    command
      .toLowerCase()
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll("*", "")
      .replaceAll("&", "")
      .replaceAll("^", "")
      .replaceAll("%", "")
      .replaceAll("$", "")
      .replaceAll("#", "")
      .replaceAll("@", "")
      .replaceAll("!", "")
      .replaceAll("~", "")
      .replaceAll("`", "")
      .replaceAll("-", "")
      .replaceAll("_", "")
      .replaceAll("+", "")
      .replaceAll("=", "")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll("{", "")
      .replaceAll("}", "")
      .replaceAll("|", "")
      .replaceAll("\\", "")
      .replaceAll("/", "")
      .replaceAll("?", "")
      .replaceAll(">", "")
      .replaceAll(".", "")
      .replaceAll("<", "")
      .replaceAll(",", "")
  );
  return allCommands.filter((cmd) => cmd.match(regex));
};
