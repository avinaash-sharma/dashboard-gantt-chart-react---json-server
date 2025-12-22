import { DollarSign, Calendar } from 'lucide-react';
import styles from './RevenueCard.module.css';

const RevenueCard = ({ data }) => {
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>REVENUE</h3>
        <DollarSign className={styles.icon} size={16} />
      </div>

      <div className={styles.mainValue}>
        <span className={styles.invoiced}>{formatCurrency(data.invoiced)}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.total}>{formatCurrency(data.total)}</span>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metricRow}>
          <span className={styles.label}>Total Invoiced</span>
          <div className={styles.valueGroup}>
            <span className={styles.value}>
              {data.totalInvoiced.value ? formatCurrency(data.totalInvoiced.value) : '$0.00'}
            </span>
          </div>
        </div>

        <div className={styles.metricRow}>
          <span className={styles.label}>Last Invoice</span>
          <div className={styles.dateValue}>
            <Calendar size={12} className={styles.calendarIcon} />
            <span>{formatDate(data.lastInvoice.date)}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.metricRow}>
          <span className={styles.label}>Days to next Invoice</span>
          <div className={styles.dateValue}>
            <Calendar size={12} className={styles.calendarIcon} />
            <span>{formatDate(data.daysToNextInvoice.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
