import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useProjectData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allData = await api.getAllData();
      setData(allData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateProject = async (project) => {
    try {
      const updated = await api.updateProject(project);
      setData(prev => ({ ...prev, project: updated }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    updateProject,
  };
};
