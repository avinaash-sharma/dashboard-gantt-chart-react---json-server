import Navigation from '../Navigation/Navigation';
import styles from './Header.module.css';

const Header = ({ title = 'Project Status Report' }) => {
  return (
    <div className={styles.headerWrapper}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>EXL</span>
          <span className={styles.separator}>|</span>
          <span className={styles.title}>{title}</span>
        </div>
      </header>
      <Navigation />
    </div>
  );
};

export default Header;
