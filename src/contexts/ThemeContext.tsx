import React from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  mode: 'light',
  setMode: () => undefined,
  toggle: () => undefined
});

interface ThemeProviderProps {
  initialMode: ThemeMode;
  children: React.ReactNode;
}

export function ThemeProvider({ initialMode, children }: ThemeProviderProps) {
  const [mode, setMode] = React.useState<ThemeMode>(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((current) => current === 'dark' ? 'light' : 'dark')
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}