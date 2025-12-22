import { useMemo } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import styles from './GanttChart.module.css';

const GanttChart = ({ milestones }) => {
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  // Calculate delay for a milestone
  const calculateDelay = (milestone) => {
    if (!milestone.expectedEndDate || !milestone.actualEndDate) return null;
    return differenceInDays(
      parseISO(milestone.actualEndDate),
      parseISO(milestone.expectedEndDate)
    );
  };

  // Calculate vertical offsets for staggered bars
  const barOffsets = useMemo(() => {
    return milestones.map((_, index) => index * 52);
  }, [milestones]);

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        {/* Header Row with Milestone Labels */}
        <div className={styles.headerRow}>
          {milestones.map((milestone) => (
            <div key={milestone.id} className={styles.milestoneHeader}>
              <span
                className={styles.milestoneName}
                style={{
                  color: milestone.progress > 0 ? milestone.color : 'var(--gray-400)'
                }}
              >
                {milestone.name}
              </span>
              <span className={styles.weekLabel}>{milestone.week}</span>
              <div className={styles.dayHeaders}>
                {milestone.tasks.map((task, taskIndex) => (
                  <span key={taskIndex} className={styles.dayLabel}>
                    {task.day}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Gantt Bars Area */}
        <div className={styles.ganttArea}>
          {/* Grid Lines */}
          <div className={styles.gridLines}>
            {milestones.map((milestone) => (
              <div key={milestone.id} className={styles.gridColumn}>
                {milestone.tasks.map((_, taskIndex) => (
                  <div key={taskIndex} className={styles.gridCell} />
                ))}
              </div>
            ))}
          </div>

          {/* Today Marker */}
          {milestones.map((milestone, index) =>
            milestone.todayMarker && (
              <div
                key={`today-${milestone.id}`}
                className={styles.todayMarker}
                style={{
                  left: `calc(${index * 20}% + ${2.5 * 20}%)`,
                }}
              >
                <div className={styles.todayLine} />
                <span className={styles.todayLabel}>
                  Today<br />
                  {milestone.todayDate && new Date(milestone.todayDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit'
                  })}
                </span>
              </div>
            )
          )}

          {/* Gantt Bars */}
          {milestones.map((milestone, index) => {
            const delay = calculateDelay(milestone);
            const hasActualDates = milestone.actualStartDate && milestone.actualEndDate;

            return (
              <div
                key={milestone.id}
                className={styles.ganttBarWrapper}
                style={{
                  top: barOffsets[index],
                  left: `${index * 20}%`,
                  width: '18%',
                }}
              >
                {/* Bar Container */}
                <div className={styles.ganttBarContainer}>
                  {/* Budget Label */}
                  <span className={styles.budgetLabel}>
                    {formatCurrency(milestone.budget)}
                  </span>

                  {/* Dual Bar Container */}
                  <div className={styles.dualBarContainer}>
                    {/* Expected Bar (dashed outline) */}
                    <div
                      className={styles.expectedBar}
                      style={{
                        borderColor: milestone.color,
                      }}
                      title={`Expected: ${milestone.expectedStartDate} to ${milestone.expectedEndDate}`}
                    />

                    {/* Actual Bar (solid fill) */}
                    <div
                      className={styles.actualBar}
                      style={{
                        backgroundColor: hasActualDates ? milestone.color : 'var(--gray-200)',
                        opacity: hasActualDates ? 1 : 0.3,
                      }}
                      title={hasActualDates
                        ? `Actual: ${milestone.actualStartDate} to ${milestone.actualEndDate}`
                        : 'No actual dates set'
                      }
                    >
                      {/* Progress Fill */}
                      <div
                        className={styles.progressBarFill}
                        style={{
                          width: `${milestone.progress}%`,
                          backgroundColor: milestone.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className={styles.progressInfo}>
                    <span
                      className={styles.progressPercent}
                      style={{
                        color: milestone.progress > 0 ? milestone.color : 'var(--gray-400)'
                      }}
                    >
                      {milestone.progress}%
                    </span>

                    {/* Delay Badge */}
                    {delay !== null && delay !== 0 && (
                      <span className={`${styles.delayBadge} ${delay > 0 ? styles.delayed : styles.early}`}>
                        {delay > 0 ? `+${delay}d` : `${delay}d`}
                      </span>
                    )}

                    {/* Checkpoint */}
                    {milestone.checkpoint && (
                      <div className={styles.checkpoint}>
                        <div
                          className={styles.checkpointDot}
                          style={{
                            backgroundColor: milestone.checkpoint.status === 'completed'
                              ? milestone.color
                              : 'var(--gray-400)',
                            borderColor: milestone.checkpoint.status === 'completed'
                              ? milestone.color
                              : 'var(--gray-300)',
                          }}
                        />
                        <span className={styles.checkpointLabel}>
                          {milestone.checkpoint.label}
                          <br />
                          <span className={styles.checkpointDate}>
                            {new Date(milestone.checkpoint.date).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit'
                            })}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendExpected} />
            <span>Expected</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendActual} />
            <span>Actual</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.delayBadge} ${styles.delayed}`}>+Xd</span>
            <span>Delayed</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.delayBadge} ${styles.early}`}>-Xd</span>
            <span>Early</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
