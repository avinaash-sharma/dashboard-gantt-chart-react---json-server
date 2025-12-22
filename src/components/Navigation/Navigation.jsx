import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database } from 'lucide-react';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ''}`
        }
      >
        <LayoutDashboard size={16} />
        Dashboard
      </NavLink>
      <NavLink
        to="/data-management"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ''}`
        }
      >
        <Database size={16} />
        Data Management
      </NavLink>
    </nav>
  );
};

export default Navigation;
