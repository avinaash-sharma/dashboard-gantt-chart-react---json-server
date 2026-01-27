import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useMilestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMilestones();
      setMilestones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const addMilestone = async (milestone) => {
    try {
      const newMilestone = await api.createMilestone(milestone);
      setMilestones(prev => [...prev, newMilestone]);
      return newMilestone;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMilestone = async (id, updates) => {
    try {
      const updated = await api.updateMilestone(id, updates);
      setMilestones(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMilestone = async (id) => {
    try {
      await api.deleteMilestone(id);
      setMilestones(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    milestones,
    setMilestones,
    loading,
    error,
    refetch: fetchMilestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
  };
};
