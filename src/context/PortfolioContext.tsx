import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortfolioData } from '../types/portfolio.ts';
import { portfolioData as initialPortfolioData } from '../../server/portfolioData.ts';

interface PortfolioContextType {
  data: PortfolioData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: initialPortfolioData,
  loading: false,
  error: null,
  refresh: async () => {},
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setError(null);
      }
    } catch (err: any) {
      console.warn('Portfolio sync notice:', err?.message);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refresh: fetchPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
