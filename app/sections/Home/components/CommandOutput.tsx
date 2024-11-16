interface CommandOutputProps {
  error: string;
  output: string;
}

export const CommandOutput = ({ error, output }: CommandOutputProps) => (
  <>
    {error && (
      <div className="text-red-500 text-left w-[548px] mb-[30px]">{error}</div>
    )}
    {output && (
      <div
        className="text-green-500 text-left w-[548px] mb-[30px]"
        dangerouslySetInnerHTML={{ __html: output }}
      />
    )}
  </>
);
