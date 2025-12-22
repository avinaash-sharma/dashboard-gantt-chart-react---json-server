import { differenceInDays, parseISO, format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import styles from './MilestoneTable.module.css';

const MilestoneTable = ({ milestones, onEdit, onDelete }) => {
  const calculateDelay = (milestone) => {
    if (!milestone.expectedEndDate || !milestone.actualEndDate) return null;
    const expected = parseISO(milestone.expectedEndDate);
    const actual = parseISO(milestone.actualEndDate);
    return differenceInDays(actual, expected);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  };

  const getDelayClass = (delay) => {
    if (delay === null) return '';
    if (delay > 0) return styles.delayed;
    if (delay < 0) return styles.early;
    return styles.onTime;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Expected Start</th>
            <th>Expected End</th>
            <th>Actual Start</th>
            <th>Actual End</th>
            <th>Delay (days)</th>
            <th>Progress</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((milestone) => {
            const delay = calculateDelay(milestone);
            return (
              <tr key={milestone.id}>
                <td>
                  <div className={styles.nameCell}>
                    <span
                      className={styles.colorDot}
                      style={{ backgroundColor: milestone.color }}
                    />
                    {milestone.name}
                  </div>
                </td>
                <td>{formatDate(milestone.expectedStartDate)}</td>
                <td>{formatDate(milestone.expectedEndDate)}</td>
                <td>{formatDate(milestone.actualStartDate)}</td>
                <td>{formatDate(milestone.actualEndDate)}</td>
                <td className={getDelayClass(delay)}>
                  {delay === null ? '-' : delay > 0 ? `+${delay}` : delay === 0 ? '0' : delay}
                </td>
                <td>
                  <div className={styles.progressCell}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>{milestone.progress}%</span>
                  </div>
                </td>
                <td className={styles.budgetCell}>
                  ${milestone.budget.toLocaleString()}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => onEdit(milestone)}
                      title="Edit milestone"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(milestone.id)}
                      title="Delete milestone"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MilestoneTable;
