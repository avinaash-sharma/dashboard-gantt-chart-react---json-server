import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useFinancialData = () => {
  const [resourceBurn, setResourceBurn] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [grossMargin, setGrossMargin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [resourceBurnData, revenueDataResult, grossMarginData] = await Promise.all([
        api.getResourceBurn(),
        api.getRevenueData(),
        api.getGrossMargin(),
      ]);
      setResourceBurn(resourceBurnData);
      setRevenueData(revenueDataResult);
      setGrossMargin(grossMarginData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateResourceBurn = async (data) => {
    try {
      const updated = await api.updateResourceBurn(data);
      setResourceBurn(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateRevenueData = async (data) => {
    try {
      const updated = await api.updateRevenueData(data);
      setRevenueData(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateGrossMargin = async (data) => {
    try {
      const updated = await api.updateGrossMargin(data);
      setGrossMargin(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refetch = () => {
    fetchData();
  };

  return {
    resourceBurn,
    revenueData,
    grossMargin,
    loading,
    error,
    updateResourceBurn,
    updateRevenueData,
    updateGrossMargin,
    refetch,
  };
};
