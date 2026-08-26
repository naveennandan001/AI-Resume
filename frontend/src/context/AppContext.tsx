import React, { createContext, useContext, useState } from 'react';
import { Resume, JobDescription } from '../types';

interface AppContextType {
  activeResume: Resume | null;
  setActiveResume: (resume: Resume | null) => void;
  activeJob: JobDescription | null;
  setActiveJob: (job: JobDescription | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [activeJob, setActiveJob] = useState<JobDescription | null>(null);

  return (
    <AppContext.Provider value={{ activeResume, setActiveResume, activeJob, setActiveJob }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
