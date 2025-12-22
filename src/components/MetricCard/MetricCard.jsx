import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './MetricCard.module.css';

const MetricCard = ({ 
  title, 
  icon: Icon,
  variant = 'default',
  children 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'warning':
        return styles.warning;
      case 'success':
        return styles.success;
      case 'danger':
        return styles.danger;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.card} ${getVariantClass()}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {Icon && <Icon className={styles.icon} size={16} />}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

// Sub-components for consistent styling
const MetricValue = ({ value, subtitle, trend }) => (
  <div className={styles.metricValue}>
    <span className={styles.value}>{value}</span>
    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    {trend && (
      <span className={`${styles.trend} ${styles[trend]}`}>
        {trend === 'up' && <TrendingUp size={12} />}
        {trend === 'down' && <TrendingDown size={12} />}
        {trend === 'neutral' && <Minus size={12} />}
      </span>
    )}
  </div>
);

const MetricRow = ({ label, value, percentage, highlight = false }) => (
  <div className={`${styles.metricRow} ${highlight ? styles.highlight : ''}`}>
    <span className={styles.rowLabel}>{label}</span>
    <div className={styles.rowValue}>
      {value && <span>{value}</span>}
      {percentage !== undefined && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          <span className={styles.progressText}>{percentage}%</span>
        </div>
      )}
    </div>
  </div>
);

const MetricDivider = () => <div className={styles.divider} />;

MetricCard.Value = MetricValue;
MetricCard.Row = MetricRow;
MetricCard.Divider = MetricDivider;

export default MetricCard;
