import { useMemo } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import styles from './DelaySummary.module.css';

const DelaySummary = ({ milestones }) => {
  const stats = useMemo(() => {
    let totalDelay = 0;
    let delayedCount = 0;
    let onTimeCount = 0;
    let earlyCount = 0;
    let pendingCount = 0;

    milestones.forEach((m) => {
      if (!m.expectedEndDate || !m.actualEndDate) {
        pendingCount++;
        return;
      }

      const delay = differenceInDays(
        parseISO(m.actualEndDate),
        parseISO(m.expectedEndDate)
      );

      if (delay > 0) {
        totalDelay += delay;
        delayedCount++;
      } else if (delay < 0) {
        earlyCount++;
      } else {
        onTimeCount++;
      }
    });

    return { totalDelay, delayedCount, onTimeCount, earlyCount, pendingCount };
  }, [milestones]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.danger}`}>
          <AlertTriangle size={20} />
        </div>
        <div className={styles.info}>
          <span className={styles.value}>{stats.totalDelay}</span>
          <span className={styles.label}>Total Days Delayed</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.warning}`}>
          <Clock size={20} />
        </div>
        <div className={styles.info}>
          <span className={styles.value}>{stats.delayedCount}</span>
          <span className={styles.label}>Milestones Delayed</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.success}`}>
          <CheckCircle size={20} />
        </div>
        <div className={styles.info}>
          <span className={styles.value}>{stats.onTimeCount + stats.earlyCount}</span>
          <span className={styles.label}>On Time / Early</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.muted}`}>
          <Clock size={20} />
        </div>
        <div className={styles.info}>
          <span className={styles.value}>{stats.pendingCount}</span>
          <span className={styles.label}>Pending</span>
        </div>
      </div>
    </div>
  );
};

export default DelaySummary;
