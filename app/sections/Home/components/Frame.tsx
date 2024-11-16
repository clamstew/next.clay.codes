import { ReactNode } from "react";

export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="text-center">
    <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center text-[calc(10px+2vmin)] text-cyan-500">
      {children}
    </header>
  </div>
);
