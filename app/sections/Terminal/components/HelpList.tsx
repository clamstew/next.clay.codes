interface HelpListProps {
  commands: Record<string, string>;
  onCommandClick: (command: string) => void;
}

export const HelpList = ({ commands, onCommandClick }: HelpListProps) => (
  <div className="flex flex-col gap-1">
    <div className="text-white/80">
      Available commands and their descriptions:
    </div>
    {Object.entries(commands).map(([cmd, description]) => (
      <div key={cmd} className="flex flex-col gap-0.5 mb-2">
        <button
          onClick={() => onCommandClick(cmd)}
          className="text-left text-blue-400 hover:bg-blue-400/10 rounded px-2 py-0.5 cursor-pointer font-mono transition-colors w-fit"
        >
          {cmd}
        </button>
        <div className="text-white/60 text-sm ml-2">{description}</div>
      </div>
    ))}
  </div>
);
