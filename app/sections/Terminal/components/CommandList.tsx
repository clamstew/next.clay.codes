interface CommandListProps {
  commands: string[];
  onCommandClick: (command: string) => void;
}

export const CommandList = ({ commands, onCommandClick }: CommandListProps) => (
  <div className="flex flex-col gap-1">
    <div className="text-white/80">Available commands:</div>
    {commands.map((cmd) => (
      <button
        key={cmd}
        onClick={() => onCommandClick(cmd)}
        className="text-left text-blue-400 hover:bg-blue-400/10 rounded px-2 py-0.5 cursor-pointer font-mono transition-colors w-fit"
      >
        {cmd}
      </button>
    ))}
  </div>
);
