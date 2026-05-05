import { createContext, useState, type ReactNode } from "react";

interface AppContextValue {
  fullscreen: boolean;
  toggleFullscreen: (value: boolean) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const toggleFullscreen = (value: boolean) => {
    setFullscreen(value);
  };

  return (
    <AppContext.Provider value={{ fullscreen, toggleFullscreen }}>
      {children}
    </AppContext.Provider>
  );
}
