import { useState, useEffect } from 'react';
import { X, Save, DollarSign, Users, TrendingUp } from 'lucide-react';
import styles from './FinancialMetricsForm.module.css';

const FinancialMetricsForm = ({
  resourceBurn,
  revenueData,
  grossMargin,
  onSave,
  onCancel
}) => {
  const [activeSection, setActiveSection] = useState('resourceBurn');
  const [formData, setFormData] = useState({
    resourceBurn: {
      totalHours: 0,
      resources: 0,
      resourcesUtilized: 0,
      resourcesNotUtilized: 0,
      budgetConsumed: { value: 0, percentage: 0 },
      monthlyBurn: { value: 0, percentage: 0 },
      weeklyBurn: { value: 0, percentage: 0 },
      remainingBudget: { value: 0, percentage: 0 },
      totalManDays: 0,
    },
    revenueData: {
      invoiced: 0,
      total: 0,
      totalInvoiced: { value: 0, date: null },
      lastInvoice: { date: '' },
      daysToNextInvoice: { days: null, date: '' },
    },
    grossMargin: {
      percentage: 0,
      grossMargin: { label: 'Gross Margin', value: null },
      currentBurnRate: { label: 'Current Burn Rate', value: null },
      totalCost: { label: 'Total Cost', value: null },
      chartData: { target: 0, actual: 0, projection: 0 },
    },
  });

  useEffect(() => {
    if (resourceBurn || revenueData || grossMargin) {
      setFormData({
        resourceBurn: resourceBurn || formData.resourceBurn,
        revenueData: revenueData || formData.revenueData,
        grossMargin: grossMargin || formData.grossMargin,
      });
    }
  }, [resourceBurn, revenueData, grossMargin]);

  const handleResourceBurnChange = (field, value, nested = false, nestedField = null) => {
    setFormData(prev => ({
      ...prev,
      resourceBurn: nested
        ? {
            ...prev.resourceBurn,
            [field]: {
              ...prev.resourceBurn[field],
              [nestedField]: parseFloat(value) || 0,
            },
          }
        : {
            ...prev.resourceBurn,
            [field]: parseFloat(value) || 0,
          },
    }));
  };

  const handleRevenueChange = (field, value, nested = false, nestedField = null) => {
    setFormData(prev => ({
      ...prev,
      revenueData: nested
        ? {
            ...prev.revenueData,
            [field]: {
              ...prev.revenueData[field],
              [nestedField]: nestedField === 'date' ? value : (parseFloat(value) || 0),
            },
          }
        : {
            ...prev.revenueData,
            [field]: parseFloat(value) || 0,
          },
    }));
  };

  const handleGrossMarginChange = (field, value, nested = false, nestedField = null) => {
    setFormData(prev => ({
      ...prev,
      grossMargin: nested
        ? {
            ...prev.grossMargin,
            [field]: {
              ...prev.grossMargin[field],
              [nestedField]: parseFloat(value) || 0,
            },
          }
        : {
            ...prev.grossMargin,
            [field]: parseFloat(value) || 0,
          },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const sections = [
    { id: 'resourceBurn', label: 'Resource Burn', icon: Users },
    { id: 'revenueData', label: 'Revenue', icon: DollarSign },
    { id: 'grossMargin', label: 'Gross Margin', icon: TrendingUp },
  ];

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h3>Edit Financial Metrics</h3>
        <button type="button" className={styles.closeBtn} onClick={onCancel}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.sectionTabs}>
        {sections.map(section => (
          <button
            key={section.id}
            type="button"
            className={`${styles.sectionTab} ${activeSection === section.id ? styles.active : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <section.icon size={14} />
            {section.label}
          </button>
        ))}
      </div>

      {activeSection === 'resourceBurn' && (
        <div className={styles.formSection}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Total Hours</label>
              <input
                type="number"
                value={formData.resourceBurn.totalHours}
                onChange={(e) => handleResourceBurnChange('totalHours', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Total Resources</label>
              <input
                type="number"
                value={formData.resourceBurn.resources}
                onChange={(e) => handleResourceBurnChange('resources', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Resources Utilized</label>
              <input
                type="number"
                value={formData.resourceBurn.resourcesUtilized || 0}
                onChange={(e) => handleResourceBurnChange('resourcesUtilized', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Resources Not Utilized</label>
              <input
                type="number"
                value={formData.resourceBurn.resourcesNotUtilized || 0}
                onChange={(e) => handleResourceBurnChange('resourcesNotUtilized', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Budget Consumed ($)</label>
              <input
                type="number"
                value={formData.resourceBurn.budgetConsumed?.value || 0}
                onChange={(e) => handleResourceBurnChange('budgetConsumed', e.target.value, true, 'value')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Budget Consumed (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.resourceBurn.budgetConsumed?.percentage || 0}
                onChange={(e) => handleResourceBurnChange('budgetConsumed', e.target.value, true, 'percentage')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Monthly Burn ($)</label>
              <input
                type="number"
                value={formData.resourceBurn.monthlyBurn?.value || 0}
                onChange={(e) => handleResourceBurnChange('monthlyBurn', e.target.value, true, 'value')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Monthly Burn (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.resourceBurn.monthlyBurn?.percentage || 0}
                onChange={(e) => handleResourceBurnChange('monthlyBurn', e.target.value, true, 'percentage')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Weekly Burn ($)</label>
              <input
                type="number"
                value={formData.resourceBurn.weeklyBurn?.value || 0}
                onChange={(e) => handleResourceBurnChange('weeklyBurn', e.target.value, true, 'value')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Weekly Burn (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.resourceBurn.weeklyBurn?.percentage || 0}
                onChange={(e) => handleResourceBurnChange('weeklyBurn', e.target.value, true, 'percentage')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Remaining Budget ($)</label>
              <input
                type="number"
                value={formData.resourceBurn.remainingBudget?.value || 0}
                onChange={(e) => handleResourceBurnChange('remainingBudget', e.target.value, true, 'value')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Remaining Budget (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.resourceBurn.remainingBudget?.percentage || 0}
                onChange={(e) => handleResourceBurnChange('remainingBudget', e.target.value, true, 'percentage')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Total Man Days</label>
              <input
                type="number"
                value={formData.resourceBurn.totalManDays}
                onChange={(e) => handleResourceBurnChange('totalManDays', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'revenueData' && (
        <div className={styles.formSection}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Invoiced ($)</label>
              <input
                type="number"
                value={formData.revenueData.invoiced}
                onChange={(e) => handleRevenueChange('invoiced', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Total Revenue ($)</label>
              <input
                type="number"
                value={formData.revenueData.total}
                onChange={(e) => handleRevenueChange('total', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Total Invoiced ($)</label>
              <input
                type="number"
                value={formData.revenueData.totalInvoiced?.value || 0}
                onChange={(e) => handleRevenueChange('totalInvoiced', e.target.value, true, 'value')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Invoice Date</label>
              <input
                type="date"
                value={formData.revenueData.lastInvoice?.date || ''}
                onChange={(e) => handleRevenueChange('lastInvoice', e.target.value, true, 'date')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Next Invoice Date</label>
              <input
                type="date"
                value={formData.revenueData.daysToNextInvoice?.date || ''}
                onChange={(e) => handleRevenueChange('daysToNextInvoice', e.target.value, true, 'date')}
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'grossMargin' && (
        <div className={styles.formSection}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Gross Margin (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.grossMargin.percentage}
                onChange={(e) => handleGrossMarginChange('percentage', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Target ($)</label>
              <input
                type="number"
                value={formData.grossMargin.chartData?.target || 0}
                onChange={(e) => handleGrossMarginChange('chartData', e.target.value, true, 'target')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Actual ($)</label>
              <input
                type="number"
                value={formData.grossMargin.chartData?.actual || 0}
                onChange={(e) => handleGrossMarginChange('chartData', e.target.value, true, 'actual')}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Projection ($)</label>
              <input
                type="number"
                value={formData.grossMargin.chartData?.projection || 0}
                onChange={(e) => handleGrossMarginChange('chartData', e.target.value, true, 'projection')}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn}>
          <Save size={14} />
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default FinancialMetricsForm;
