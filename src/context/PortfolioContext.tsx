import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortfolioData } from '../types/portfolio.ts';

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/portfolio');
      if (!res.ok) {
        throw new Error(`Failed to load portfolio data (${res.status})`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching portfolio data from backend:', err);
      setError(err?.message || 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
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
