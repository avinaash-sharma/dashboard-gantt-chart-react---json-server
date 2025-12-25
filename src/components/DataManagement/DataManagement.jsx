import { useState } from 'react';
import Header from '../Header/Header';
import MilestoneTable from '../MilestoneTable/MilestoneTable';
import MilestoneForm from '../MilestoneForm/MilestoneForm';
import DelaySummary from '../DelaySummary/DelaySummary';
import FinancialMetricsForm from '../FinancialMetricsForm/FinancialMetricsForm';
import { useMilestones } from '../../hooks/useMilestones';
import { useFinancialData } from '../../hooks/useFinancialData';
import { Plus, RefreshCw, Calendar, DollarSign } from 'lucide-react';
import styles from './DataManagement.module.css';

const DataManagement = () => {
  const { milestones, loading, error, addMilestone, updateMilestone, deleteMilestone, refetch } = useMilestones();
  const {
    resourceBurn,
    revenueData,
    grossMargin,
    loading: financialLoading,
    error: financialError,
    updateResourceBurn,
    updateRevenueData,
    updateGrossMargin,
    refetch: refetchFinancial
  } = useFinancialData();
  const [activeTab, setActiveTab] = useState('milestones');
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingFinancials, setIsEditingFinancials] = useState(false);

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

  const handleEditFinancials = () => {
    setIsEditingFinancials(true);
  };

  const handleSaveFinancials = async (formData) => {
    try {
      await Promise.all([
        updateResourceBurn(formData.resourceBurn),
        updateRevenueData(formData.revenueData),
        updateGrossMargin(formData.grossMargin),
      ]);
      setIsEditingFinancials(false);
    } catch (err) {
      console.error('Failed to save financial data:', err);
    }
  };

  const handleCancelFinancials = () => {
    setIsEditingFinancials(false);
  };

  const isLoading = loading || financialLoading;
  const hasError = error || financialError;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header title="Data Management" />
        <main className={styles.main}>
          <div className={styles.loading}>Loading data...</div>
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.container}>
        <Header title="Data Management" />
        <main className={styles.main}>
          <div className={styles.error}>
            <p>Error loading data: {error || financialError}</p>
            <p className={styles.errorHint}>
              Make sure the JSON server is running. Run <code>npm run dev</code> to start both the app and the API server.
            </p>
            <button onClick={() => { refetch(); refetchFinancial(); }} className={styles.retryBtn}>
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

          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === 'milestones' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('milestones')}
            >
              <Calendar size={16} />
              Milestones
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'financials' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('financials')}
            >
              <DollarSign size={16} />
              Financial Metrics
            </button>
          </div>

          {activeTab === 'milestones' && (
            <>
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
            </>
          )}

          {activeTab === 'financials' && (
            <>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.title}>Financial Metrics</h2>
                  <p className={styles.subtitle}>Manage resource burn, revenue, and gross margin data</p>
                </div>
                {!isEditingFinancials && (
                  <button
                    className={styles.addButton}
                    onClick={handleEditFinancials}
                  >
                    <Plus size={16} />
                    Edit Metrics
                  </button>
                )}
              </div>

              {isEditingFinancials ? (
                <FinancialMetricsForm
                  resourceBurn={resourceBurn}
                  revenueData={revenueData}
                  grossMargin={grossMargin}
                  onSave={handleSaveFinancials}
                  onCancel={handleCancelFinancials}
                />
              ) : (
                <div className={styles.financialSummary}>
                  <div className={styles.summaryCard}>
                    <h4>Resource Burn</h4>
                    <div className={styles.summaryRow}>
                      <span>Total Hours:</span>
                      <strong>{resourceBurn?.totalHours?.toLocaleString() || 0} hrs</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Resources:</span>
                      <strong>{resourceBurn?.resources || 0}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Budget Consumed:</span>
                      <strong>${(resourceBurn?.budgetConsumed?.value || 0).toLocaleString()} ({resourceBurn?.budgetConsumed?.percentage || 0}%)</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Monthly Burn:</span>
                      <strong>${(resourceBurn?.monthlyBurn?.value || 0).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className={styles.summaryCard}>
                    <h4>Revenue</h4>
                    <div className={styles.summaryRow}>
                      <span>Invoiced:</span>
                      <strong>${(revenueData?.invoiced || 0).toLocaleString()}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Total Revenue:</span>
                      <strong>${(revenueData?.total || 0).toLocaleString()}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Last Invoice:</span>
                      <strong>{revenueData?.lastInvoice?.date || '-'}</strong>
                    </div>
                  </div>

                  <div className={styles.summaryCard}>
                    <h4>Gross Margin</h4>
                    <div className={styles.summaryRow}>
                      <span>Percentage:</span>
                      <strong>{grossMargin?.percentage || 0}%</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Target:</span>
                      <strong>${(grossMargin?.chartData?.target || 0).toLocaleString()}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Actual:</span>
                      <strong>${(grossMargin?.chartData?.actual || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DataManagement;
