import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowUpDown, Search, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../Header/Header';
import { importResourceAllocation } from '../../services/exportService';
import styles from './ResourceAllocation.module.css';

const ResourceAllocation = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const monthColumns = [
    'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026',
    'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026',
    'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'
  ];

  useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(data.map(item => item.role).filter(Boolean))];
    return ['all', ...roles.sort()];
  }, [data]);

  const uniqueLocations = useMemo(() => {
    const locations = [...new Set(data.map(item => item.location).filter(Boolean))];
    return ['all', ...locations.sort()];
  }, [data]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const employeeName = String(item.employeeName || '').toLowerCase();
        const empId = String(item.empId || '').toLowerCase();
        const projectName = String(item.projectName || '').toLowerCase();
        const projectCode = String(item.projectCode || '').toLowerCase();

        return employeeName.includes(searchLower) ||
               empId.includes(searchLower) ||
               projectName.includes(searchLower) ||
               projectCode.includes(searchLower);
      });
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(item => item.role === filterRole);
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(item => item.location === filterLocation);
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, filterRole, filterLocation, sortConfig]);

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatAllocation = (value) => {
    if (!value) return '-';
    return Number(value).toFixed(2);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      const importedData = await importResourceAllocation(file);
      setData(importedData);
      setImportSuccess(true);
      console.log(`Successfully imported ${importedData.length} resources`);
    } catch (error) {
      console.error('Import error:', error);
      setImportError(error.message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.accentBar} />

          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Monthly Resource Allocation</h1>
              <p className={styles.subtitle}>
                {filteredData.length === 0
                  ? 'No data available. Import your resource allocation data to get started.'
                  : `${filteredData.length} resource${filteredData.length !== 1 ? 's' : ''} allocated`
                }
              </p>
            </div>

            <div className={styles.actions}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                className={`${styles.actionButton} ${styles.importButton}`}
                onClick={handleImportClick}
                disabled={isImporting}
                title="Import resource allocation data"
              >
                <Upload size={16} />
                <span>{isImporting ? 'Importing...' : 'Import'}</span>
              </button>
              <button className={styles.actionButton} title="Export data" disabled>
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {importError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{importError}</span>
            </div>
          )}

          {importSuccess && (
            <div className={styles.successBanner}>
              <CheckCircle size={16} />
              <span>Successfully imported {data.length} resource allocation records!</span>
            </div>
          )}

          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name, ID, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className={styles.filterSelect}
                >
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>
                      {role === 'all' ? 'All Roles' : role}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className={styles.filterSelect}
                >
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('trim')}>
                      <span>TRIM</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('projectCode')}>
                      <span>Project Code</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('projectName')}>
                      <span>Project Name</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('empId')}>
                      <span>Emp ID</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('employeeName')}>
                      <span>Employee Name</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('empType')}>
                      <span>Emp/Contractor</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('band')}>
                      <span>Band</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('working')}>
                      <span>Working</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('location')}>
                      <span>Location</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('role')}>
                      <span>Role</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('costPerMonth')}>
                      <span>Cost Per Month</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                  {monthColumns.map((month, idx) => (
                    <th key={idx} className={styles.monthColumn}>
                      <span>{month}</span>
                    </th>
                  ))}
                  <th>
                    <button className={styles.sortButton} onClick={() => handleSort('totalCost')}>
                      <span>Total Cost</span>
                      <ArrowUpDown size={12} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={24} className={styles.emptyState}>
                      <div className={styles.emptyContent}>
                        <p className={styles.emptyTitle}>No resource allocation data</p>
                        <p className={styles.emptyText}>
                          Import your Excel file to visualize monthly resource allocation across projects.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.trim || '-'}</td>
                      <td>{row.projectCode || '-'}</td>
                      <td>{row.projectName || '-'}</td>
                      <td>{row.empId || '-'}</td>
                      <td className={styles.nameCell}>{row.employeeName || '-'}</td>
                      <td>{row.empType || '-'}</td>
                      <td className={styles.bandCell}>{row.band || '-'}</td>
                      <td>{row.working || '-'}</td>
                      <td>{row.location || '-'}</td>
                      <td className={styles.roleCell}>{row.role || '-'}</td>
                      <td className={styles.costCell}>{formatCurrency(row.costPerMonth)}</td>
                      {monthColumns.map((_, midx) => (
                        <td key={midx} className={styles.allocationCell}>
                          {formatAllocation(row[`month${midx}`])}
                        </td>
                      ))}
                      <td className={styles.totalCostCell}>{formatCurrency(row.totalCost)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
