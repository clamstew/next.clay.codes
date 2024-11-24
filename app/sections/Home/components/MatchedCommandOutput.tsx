interface MatchedCommandOutputProps {
  tryAgain: () => void;
  command: string;
  runCommand: (cmd: string) => void;
}

export const MatchedCommandOutput = ({
  command,
  runCommand,
  tryAgain,
}: MatchedCommandOutputProps) => (
  <div>
    <span>Press</span>{" "}
    <button
      onClick={() => runCommand(command)}
      className="bg-[#282c34] border border-white text-white rounded-[5px] text-[18px] cursor-pointer hover:shadow-[0_0_0_2px_white]"
    >
      Enter
    </button>{" "}
    <span>or</span>{" "}
    <button onClick={tryAgain} className="text-[#61dafb]">
      Try again.
    </button>
  </div>
);
