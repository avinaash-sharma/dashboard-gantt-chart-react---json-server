import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import ProjectInfo from '../ProjectInfo/ProjectInfo';
import ControlBar from '../ControlBar/ControlBar';
import GanttChart from '../GanttChart/GanttChart';
import DelaySummary from '../DelaySummary/DelaySummary';
import ResourceBurnCard from '../ResourceBurnCard/ResourceBurnCard';
import RevenueCard from '../RevenueCard/RevenueCard';
import GrossMarginCard from '../GrossMarginCard/GrossMarginCard';
import ImportModal from '../ImportModal/ImportModal';
import { useProjectData } from '../../hooks/useProjectData';
import { useMilestones } from '../../hooks/useMilestones';
import { exportToCSV, exportToExcel, importFromFile } from '../../services/exportService';
import projectDataFallback from '../../data/projectData.json';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { data: apiData, loading: apiLoading, error: apiError, updateProject } = useProjectData();
  const { milestones, loading: milestonesLoading, setMilestones } = useMilestones();
  const [data, setData] = useState(projectDataFallback);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Use API data when available, fallback to static data
  useEffect(() => {
    if (apiData && !apiError) {
      setData(prev => ({
        ...prev,
        project: apiData.project || prev.project,
        resourceBurn: apiData.resourceBurn || prev.resourceBurn,
        revenueData: apiData.revenueData || prev.revenueData,
        grossMargin: apiData.grossMargin || prev.grossMargin,
      }));
    }
  }, [apiData, apiError]);

  const handleProjectChange = async (updatedProject) => {
    setData(prev => ({
      ...prev,
      project: updatedProject
    }));

    // Try to persist to API
    try {
      await updateProject(updatedProject);
    } catch (err) {
      console.warn('Failed to persist project changes to API:', err);
    }
  };

  const loading = apiLoading || milestonesLoading;
  const displayMilestones = milestones.length > 0 ? milestones : data.milestones;

  const handleExportCSV = () => {
    exportToCSV({
      project: data.project,
      milestones: displayMilestones,
      resourceBurn: data.resourceBurn,
      revenueData: data.revenueData,
      grossMargin: data.grossMargin,
    });
  };

  const handleExportExcel = () => {
    exportToExcel({
      project: data.project,
      milestones: displayMilestones,
      resourceBurn: data.resourceBurn,
      revenueData: data.revenueData,
      grossMargin: data.grossMargin,
    });
  };

  const handleImport = async (file) => {
    const existingData = {
      project: data.project,
      milestones: displayMilestones,
      resourceBurn: data.resourceBurn,
      revenueData: data.revenueData,
      grossMargin: data.grossMargin,
    };

    const importedData = await importFromFile(file, existingData);

    // Update local state with imported data
    setData(prev => ({
      ...prev,
      project: importedData.project,
      milestones: importedData.milestones,
      resourceBurn: importedData.resourceBurn,
      revenueData: importedData.revenueData,
      grossMargin: importedData.grossMargin,
    }));

    // Update milestones in the hook if available
    if (setMilestones && importedData.milestones) {
      setMilestones(importedData.milestones);
    }

    // Try to persist to API
    try {
      await updateProject(importedData.project);
    } catch (err) {
      console.warn('Failed to persist imported data to API:', err);
    }
  };

  return (
    <div className={styles.dashboard}>
      <Header title="Project Status Report" />

      <main className={styles.main}>
        <div className={styles.card}>
          {/* Orange accent bar */}
          <div className={styles.accentBar} />

          <ProjectInfo project={data.project} />

          <ControlBar
            project={data.project}
            statusOptions={data.statusOptions}
            chartInterval={data.chartInterval}
            onProjectChange={handleProjectChange}
            onExportCSV={handleExportCSV}
            onExportExcel={handleExportExcel}
            onImportClick={() => setIsImportModalOpen(true)}
          />

          {/* Delay Summary */}
          <div className={styles.delaySummarySection}>
            <h3 className={styles.sectionTitle}>Project Timeline Status</h3>
            <DelaySummary milestones={displayMilestones} />
          </div>

          {loading ? (
            <div className={styles.loading}>Loading chart data...</div>
          ) : (
            <GanttChart milestones={displayMilestones} />
          )}

          <div className={styles.metricsRow}>
            <ResourceBurnCard data={data.resourceBurn} />
            <RevenueCard data={data.revenueData} />
            <GrossMarginCard data={data.grossMargin} />
          </div>
        </div>
      </main>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default Dashboard;
