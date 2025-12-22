import { TrendingUp } from 'lucide-react';
import styles from './GrossMarginCard.module.css';

const GrossMarginCard = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate bar heights based on values
  const maxValue = Math.max(
    data.chartData.target,
    data.chartData.actual,
    data.chartData.projection
  );

  const getBarHeight = (value) => {
    return (value / maxValue) * 100;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>GROSS MARGIN</h3>
        <TrendingUp className={styles.icon} size={16} />
      </div>

      <div className={styles.mainValue}>
        <span className={styles.percentage}>{data.percentage}%</span>
        <span className={styles.label}>Gross Margin</span>
      </div>

      <div className={styles.content}>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Current Burn Rate</span>
            <span className={styles.infoValue}>-</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Total Cost</span>
            <span className={styles.infoValue}>-</span>
          </div>
        </div>

        <div className={styles.chartSection}>
          <div className={styles.miniChart}>
            <div className={styles.chartBars}>
              <div className={styles.barGroup}>
                <div 
                  className={`${styles.bar} ${styles.target}`}
                  style={{ height: `${getBarHeight(data.chartData.target)}%` }}
                />
                <span className={styles.barValue}>
                  {formatCurrency(data.chartData.target)}
                </span>
              </div>
              <div className={styles.barGroup}>
                <div 
                  className={`${styles.bar} ${styles.actual}`}
                  style={{ height: `${getBarHeight(data.chartData.actual)}%` }}
                />
                <span className={styles.barValue}>
                  {formatCurrency(data.chartData.actual)}
                </span>
              </div>
              <div className={styles.barGroup}>
                <div 
                  className={`${styles.bar} ${styles.projection}`}
                  style={{ height: `${getBarHeight(data.chartData.projection)}%` }}
                />
                <span className={styles.barValue}>
                  {formatCurrency(data.chartData.projection)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrossMarginCard;
