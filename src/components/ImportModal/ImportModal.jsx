import { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './ImportModal.module.css';

const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    setSuccess(false);

    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    setError(null);
    setSuccess(false);
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setError('Please select a CSV or Excel (.xlsx) file');
      setFile(null);
      return;
    }

    setFile(file);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      await onImport(file);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to import file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const getFileIcon = () => {
    if (!file) return null;
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.csv')) {
      return <FileText size={24} className={styles.fileIconCsv} />;
    }
    return <FileSpreadsheet size={24} className={styles.fileIconExcel} />;
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Import Data</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Upload a previously exported CSV or Excel file to update the dashboard data.
            The file format must match the export format.
          </p>

          <div
            className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''} ${file ? styles.dropZoneHasFile : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />

            {file ? (
              <div className={styles.fileInfo}>
                {getFileIcon()}
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ) : (
              <>
                <Upload size={32} className={styles.uploadIcon} />
                <p className={styles.dropText}>
                  Drag and drop your file here, or <span className={styles.browseLink}>browse</span>
                </p>
                <p className={styles.supportedFormats}>
                  Supported formats: CSV, Excel (.xlsx)
                </p>
              </>
            )}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <CheckCircle size={16} />
              <span>Data imported successfully!</span>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
          <button
            className={styles.importButton}
            onClick={handleImport}
            disabled={!file || isLoading || success}
          >
            {isLoading ? 'Importing...' : 'Import Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
