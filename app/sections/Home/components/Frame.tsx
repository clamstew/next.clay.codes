import { ReactNode } from "react";

export const Frame = ({ children }: { children: ReactNode }) => (
  <div className="text-center">
    <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center p-4 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-500">
      {children}
    </header>
  </div>
);
