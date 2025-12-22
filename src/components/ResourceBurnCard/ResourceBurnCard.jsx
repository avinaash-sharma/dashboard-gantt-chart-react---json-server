import { Users } from 'lucide-react';
import styles from './ResourceBurnCard.module.css';

const ResourceBurnCard = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>RESOURCE BURN</h3>
        <span className={styles.resourceBadge}>
          <Users size={12} />
          {data.resources} Resource
        </span>
      </div>

      <div className={styles.mainValue}>
        <span className={styles.hours}>{data.totalHours.toLocaleString()}</span>
        <span className={styles.hoursLabel}>hrs</span>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metricRow}>
          <span className={styles.label}>Budget Consumed</span>
          <div className={styles.valueWithProgress}>
            <span className={styles.value}>{formatCurrency(data.budgetConsumed.value)}</span>
            <div className={styles.progressWrapper}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${data.budgetConsumed.percentage}%` }}
                />
              </div>
              <span className={styles.percentage}>{data.budgetConsumed.percentage}%</span>
            </div>
          </div>
        </div>

        <div className={styles.metricRow}>
          <span className={styles.label}>Monthly Burn</span>
          <div className={styles.valueWithProgress}>
            <span className={styles.value}>{formatCurrency(data.monthlyBurn.value)}</span>
            <div className={styles.progressWrapper}>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${styles.warning}`}
                  style={{ width: `${data.monthlyBurn.percentage}%` }}
                />
              </div>
              <span className={`${styles.percentage} ${styles.warning}`}>
                {data.monthlyBurn.percentage}%
              </span>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.metricRow}>
          <span className={styles.label}>Total Man Days</span>
          <span className={styles.daysValue}>{data.totalManDays} days</span>
        </div>
      </div>
    </div>
  );
};

export default ResourceBurnCard;
