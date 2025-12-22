import { useState } from 'react';
import Header from '../Header/Header';
import MilestoneTable from '../MilestoneTable/MilestoneTable';
import MilestoneForm from '../MilestoneForm/MilestoneForm';
import DelaySummary from '../DelaySummary/DelaySummary';
import { useMilestones } from '../../hooks/useMilestones';
import { Plus, RefreshCw } from 'lucide-react';
import styles from './DataManagement.module.css';

const DataManagement = () => {
  const { milestones, loading, error, addMilestone, updateMilestone, deleteMilestone, refetch } = useMilestones();
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEdit = (milestone) => {
    setEditingMilestone(milestone);
    setIsAddingNew(false);
  };

  const handleSave = async (milestoneData) => {
    try {
      if (editingMilestone) {
        await updateMilestone(editingMilestone.id, milestoneData);
      } else {
        await addMilestone(milestoneData);
      }
      setEditingMilestone(null);
      setIsAddingNew(false);
    } catch (err) {
      console.error('Failed to save milestone:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        await deleteMilestone(id);
      } catch (err) {
        console.error('Failed to delete milestone:', err);
      }
    }
  };

  const handleCancel = () => {
    setEditingMilestone(null);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingMilestone(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header title="Data Management" />
        <main className={styles.main}>
          <div className={styles.loading}>Loading milestones...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header title="Data Management" />
        <main className={styles.main}>
          <div className={styles.error}>
            <p>Error loading data: {error}</p>
            <p className={styles.errorHint}>
              Make sure the JSON server is running. Run <code>npm run dev</code> to start both the app and the API server.
            </p>
            <button onClick={refetch} className={styles.retryBtn}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="Data Management" />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.accentBar} />

          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.title}>Milestones</h2>
              <p className={styles.subtitle}>Manage project milestones, dates, and track delays</p>
            </div>
            <button
              className={styles.addButton}
              onClick={handleAddNew}
            >
              <Plus size={16} />
              Add Milestone
            </button>
          </div>

          <DelaySummary milestones={milestones} />

          {(isAddingNew || editingMilestone) && (
            <MilestoneForm
              milestone={editingMilestone}
              onSave={handleSave}
              onCancel={handleCancel}
              existingMilestones={milestones}
            />
          )}

          <MilestoneTable
            milestones={milestones}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
};

export default DataManagement;
