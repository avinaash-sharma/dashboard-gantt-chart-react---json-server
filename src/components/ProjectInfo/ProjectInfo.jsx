import styles from './ProjectInfo.module.css';

const ProjectInfo = ({ project }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.projectDetails}>
        <h1 className={styles.projectName}>{project.name}</h1>
        <p className={styles.projectDescription}>{project.description}</p>
      </div>
      <div className={styles.clientValue}>
        <span className={styles.clientValueLabel}>CLIENT VALUE</span>
        <span className={styles.clientValueAmount}>
          {formatCurrency(project.clientValue)}
        </span>
      </div>
    </div>
  );
};

export default ProjectInfo;
