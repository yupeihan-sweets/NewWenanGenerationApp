import React, { createContext, useContext, useState } from 'react';
import { GenderTheme } from '@/types';

interface ThemeContextType {
  gender: GenderTheme;
  setGender: (gender: GenderTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gender, setGender] = useState<GenderTheme>('female');

  return (
    <ThemeContext.Provider value={{ gender, setGender }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

