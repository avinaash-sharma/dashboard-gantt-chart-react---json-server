import { useState, useEffect } from 'react';
import { Calendar, X, Save } from 'lucide-react';
import styles from './MilestoneForm.module.css';

const MILESTONE_COLORS = [
  '#8BC34A', '#D7A07A', '#FFB74D', '#90A4AE', '#B0BEC5',
  '#4CAF50', '#2196F3', '#9C27B0', '#F44336', '#00BCD4'
];

const MilestoneForm = ({ milestone, onSave, onCancel, existingMilestones }) => {
  const [formData, setFormData] = useState({
    name: '',
    week: '',
    expectedStartDate: '',
    expectedEndDate: '',
    actualStartDate: '',
    actualEndDate: '',
    progress: 0,
    budget: 0,
    color: MILESTONE_COLORS[0],
    tasks: [],
    checkpoint: null,
  });

  useEffect(() => {
    if (milestone) {
      setFormData({
        name: milestone.name || '',
        week: milestone.week || '',
        expectedStartDate: milestone.expectedStartDate || milestone.startDate || '',
        expectedEndDate: milestone.expectedEndDate || milestone.endDate || '',
        actualStartDate: milestone.actualStartDate || '',
        actualEndDate: milestone.actualEndDate || '',
        progress: milestone.progress || 0,
        budget: milestone.budget || 0,
        color: milestone.color || MILESTONE_COLORS[0],
        tasks: milestone.tasks || [],
        checkpoint: milestone.checkpoint || null,
      });
    } else {
      // Reset form for new milestone
      setFormData({
        name: '',
        week: '',
        expectedStartDate: '',
        expectedEndDate: '',
        actualStartDate: '',
        actualEndDate: '',
        progress: 0,
        budget: 43000,
        color: MILESTONE_COLORS[existingMilestones?.length % MILESTONE_COLORS.length || 0],
        tasks: [],
        checkpoint: null,
      });
    }
  }, [milestone, existingMilestones]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate ID for new milestones
    const newId = milestone?.id || Math.max(0, ...existingMilestones.map(m => m.id)) + 1;

    onSave({
      ...formData,
      id: newId,
      // Keep backward compatibility with startDate/endDate
      startDate: formData.actualStartDate || formData.expectedStartDate,
      endDate: formData.actualEndDate || formData.expectedEndDate,
      // Ensure actualEndDate is null if empty string
      actualStartDate: formData.actualStartDate || null,
      actualEndDate: formData.actualEndDate || null,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h3>{milestone ? 'Edit Milestone' : 'Add New Milestone'}</h3>
        <button type="button" className={styles.closeBtn} onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., MILESTONE 1"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Week</label>
          <input
            type="text"
            value={formData.week}
            onChange={(e) => handleChange('week', e.target.value)}
            placeholder="e.g., WEEK 1"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Expected Start Date</label>
          <div className={styles.inputWrapper}>
            <input
              type="date"
              value={formData.expectedStartDate}
              onChange={(e) => handleChange('expectedStartDate', e.target.value)}
              required
            />
            <Calendar className={styles.inputIcon} size={14} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Expected End Date</label>
          <div className={styles.inputWrapper}>
            <input
              type="date"
              value={formData.expectedEndDate}
              onChange={(e) => handleChange('expectedEndDate', e.target.value)}
              required
            />
            <Calendar className={styles.inputIcon} size={14} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Actual Start Date</label>
          <div className={styles.inputWrapper}>
            <input
              type="date"
              value={formData.actualStartDate}
              onChange={(e) => handleChange('actualStartDate', e.target.value)}
            />
            <Calendar className={styles.inputIcon} size={14} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Actual End Date</label>
          <div className={styles.inputWrapper}>
            <input
              type="date"
              value={formData.actualEndDate}
              onChange={(e) => handleChange('actualEndDate', e.target.value)}
            />
            <Calendar className={styles.inputIcon} size={14} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Progress (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Budget ($)</label>
          <input
            type="number"
            min="0"
            value={formData.budget}
            onChange={(e) => handleChange('budget', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className={styles.formGroup + ' ' + styles.fullWidth}>
          <label>Color</label>
          <div className={styles.colorPicker}>
            {MILESTONE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorOption} ${formData.color === color ? styles.selected : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('color', color)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn}>
          <Save size={16} />
          {milestone ? 'Update' : 'Create'} Milestone
        </button>
      </div>
    </form>
  );
};

export default MilestoneForm;
