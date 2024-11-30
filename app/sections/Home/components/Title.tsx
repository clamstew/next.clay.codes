export const Title = ({
  isFullscreenTerminal,
  setIsFullscreenTerminal,
}: {
  isFullscreenTerminal: boolean;
  setIsFullscreenTerminal: (isFullscreenTerminal: boolean) => void;
}) => (
  // TODO: Move this to a higher up callback that is passed down
  <button onClick={() => setIsFullscreenTerminal(!isFullscreenTerminal)}>
    <code className="text-[14px] [@media(min-width:185px)]:text-[18px] [@media(min-width:245px)]:text-[24px] [@media(min-width:400px)]:text-[32px] [@media(min-width:640px)]:text-[40px] font-normal select-none">
      <span
        className={isFullscreenTerminal ? "text-green-500" : "text-[#F92672]"}
      >
        &lt;
      </span>
      <span
        className={isFullscreenTerminal ? "text-green-500" : "text-[#A6E22E]"}
      >
        clay
      </span>
      <span
        className={isFullscreenTerminal ? "text-green-500" : "text-[#FD971F]"}
      >
        .codes
      </span>
      <span
        className={isFullscreenTerminal ? "text-green-500" : "text-[#66D9EF]"}
      >
        {" "}
        /
      </span>
      <span
        className={isFullscreenTerminal ? "text-green-500" : "text-[#F92672]"}
      >
        &gt;
      </span>
    </code>
  </button>
);
