import { Calendar, ChevronDown, Download, FileSpreadsheet, Upload } from 'lucide-react';
import styles from './ControlBar.module.css';

const ControlBar = ({ project, statusOptions, chartInterval, onProjectChange, onExportCSV, onExportExcel, onImportClick }) => {
  const handleChange = (field, value) => {
    onProjectChange({ ...project, [field]: value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.controlsLeft}>
        {/* Start Date */}
        <div className={styles.controlGroup}>
          <label className={styles.label}>Start Date</label>
          <div className={styles.inputWrapper}>
            <input
              type="date"
              value={project.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={styles.dateInput}
            />
            <Calendar className={styles.inputIcon} size={14} />
          </div>
        </div>

        {/* End Date */}
        <div className={styles.controlGroup}>
          <label className={styles.label}>End Date</label>
          <div className={styles.inputWrapper}>
            <input
              type="date"
              value={project.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className={styles.dateInput}
            />
            <Calendar className={styles.inputIcon} size={14} />
          </div>
        </div>

        {/* Days */}
        <div className={styles.controlGroup}>
          <label className={styles.label}>Days</label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={project.days}
              onChange={(e) => handleChange('days', parseInt(e.target.value))}
              className={styles.numberInput}
              min="1"
            />
          </div>
        </div>

        {/* Status */}
        <div className={styles.controlGroup}>
          <label className={styles.label}>Status</label>
          <div className={styles.selectWrapper}>
            <select
              value={project.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={styles.select}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className={styles.selectIcon} size={14} />
          </div>
        </div>

        {/* Resource */}
        <div className={styles.controlGroup}>
          <label className={styles.label}>Resource</label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={project.resource}
              onChange={(e) => handleChange('resource', parseInt(e.target.value))}
              className={styles.numberInput}
              min="1"
            />
          </div>
        </div>

        {/* Revenue */}
        <div className={styles.controlGroup}>
          <label className={styles.label}>Revenue</label>
          <div className={styles.inputWrapper}>
            <span className={styles.currencyPrefix}>$</span>
            <input
              type="number"
              value={project.revenue}
              onChange={(e) => handleChange('revenue', parseInt(e.target.value))}
              className={styles.currencyInput}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.controlsRight}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>Chart Interval</label>
          <div className={styles.intervalButtons}>
            {chartInterval.options.map((option) => (
              <button
                key={option}
                className={`${styles.intervalButton} ${
                  chartInterval.selected === option ? styles.intervalButtonActive : ''
                }`}
                onClick={() => {}}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Import / Export</label>
          <div className={styles.exportButtons}>
            <button
              className={`${styles.exportButton} ${styles.importButton}`}
              onClick={onImportClick}
              title="Import from CSV or Excel"
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
            <button
              className={styles.exportButton}
              onClick={onExportCSV}
              title="Export as CSV"
            >
              <Download size={14} />
              <span>CSV</span>
            </button>
            <button
              className={`${styles.exportButton} ${styles.exportButtonExcel}`}
              onClick={onExportExcel}
              title="Export as Excel"
            >
              <FileSpreadsheet size={14} />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
