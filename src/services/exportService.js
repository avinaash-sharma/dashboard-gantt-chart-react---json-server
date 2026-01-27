import * as XLSX from 'xlsx';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  return `$${value.toLocaleString()}`;
};

const parseCurrency = (value) => {
  if (!value || value === '' || value === 'N/A') return null;
  const cleaned = String(value).replace(/[$,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const parsePercentage = (value) => {
  if (!value || value === '' || value === 'N/A') return null;
  const cleaned = String(value).replace('%', '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const parseDate = (value) => {
  if (!value || value === '') return null;
  return String(value);
};

const formatDate = (date) => {
  if (!date) return '';
  return date;
};

const prepareMilestonesData = (milestones) => {
  return milestones.map((m) => ({
    'Milestone Name': m.name,
    'Week': m.week || '',
    'Expected Start Date': formatDate(m.expectedStartDate),
    'Expected End Date': formatDate(m.expectedEndDate),
    'Actual Start Date': formatDate(m.actualStartDate),
    'Actual End Date': formatDate(m.actualEndDate),
    'Progress (%)': m.progress,
    'Budget': formatCurrency(m.budget),
    'Status': m.progress === 100 ? 'Completed' : m.progress > 0 ? 'In Progress' : 'Pending',
  }));
};

const prepareProjectData = (project) => {
  return [{
    'Project Name': project.name,
    'Description': project.description,
    'Start Date': formatDate(project.startDate),
    'End Date': formatDate(project.endDate),
    'Duration (Days)': project.days,
    'Status': project.status,
    'Resources': project.resource,
    'Revenue': formatCurrency(project.revenue),
    'Client Value': formatCurrency(project.clientValue),
  }];
};

const prepareResourceBurnData = (resourceBurn) => {
  return [{
    'Total Hours': resourceBurn.totalHours,
    'Resources Allocated': resourceBurn.resources,
    'Resources Utilized': resourceBurn.resourcesUtilized,
    'Resources Not Utilized': resourceBurn.resourcesNotUtilized,
    'Budget Consumed': formatCurrency(resourceBurn.budgetConsumed?.value),
    'Budget Consumed (%)': `${resourceBurn.budgetConsumed?.percentage}%`,
    'Monthly Burn': formatCurrency(resourceBurn.monthlyBurn?.value),
    'Monthly Burn (%)': `${resourceBurn.monthlyBurn?.percentage}%`,
    'Weekly Burn': formatCurrency(resourceBurn.weeklyBurn?.value),
    'Weekly Burn (%)': `${resourceBurn.weeklyBurn?.percentage}%`,
    'Remaining Budget': formatCurrency(resourceBurn.remainingBudget?.value),
    'Remaining Budget (%)': `${resourceBurn.remainingBudget?.percentage}%`,
    'Total Man Days': resourceBurn.totalManDays,
  }];
};

const prepareRevenueData = (revenueData) => {
  return [{
    'Invoiced Amount': formatCurrency(revenueData.invoiced),
    'Total Revenue': formatCurrency(revenueData.total),
    'Total Invoiced': formatCurrency(revenueData.totalInvoiced?.value),
    'Last Invoice Date': formatDate(revenueData.lastInvoice?.date),
    'Days to Next Invoice': revenueData.daysToNextInvoice?.days || 'N/A',
    'Next Invoice Date': formatDate(revenueData.daysToNextInvoice?.date),
  }];
};

const prepareGrossMarginData = (grossMargin) => {
  return [{
    'Gross Margin (%)': `${grossMargin.percentage}%`,
    'Target': formatCurrency(grossMargin.chartData?.target),
    'Actual': formatCurrency(grossMargin.chartData?.actual),
    'Projection': formatCurrency(grossMargin.chartData?.projection),
  }];
};

const arrayToCSV = (data, sheetName = '') => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  if (sheetName) {
    csvRows.push(`--- ${sheetName} ---`);
  }

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
        ? `"${escaped}"`
        : escaped;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

export const exportToCSV = (data) => {
  const { project, milestones, resourceBurn, revenueData, grossMargin } = data;

  const sections = [];

  sections.push(arrayToCSV(prepareProjectData(project), 'PROJECT INFO'));
  sections.push('');

  sections.push(arrayToCSV(prepareMilestonesData(milestones), 'MILESTONES'));
  sections.push('');

  sections.push(arrayToCSV(prepareResourceBurnData(resourceBurn), 'RESOURCE BURN'));
  sections.push('');

  sections.push(arrayToCSV(prepareRevenueData(revenueData), 'REVENUE'));
  sections.push('');

  sections.push(arrayToCSV(prepareGrossMarginData(grossMargin), 'GROSS MARGIN'));

  const csvContent = sections.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `project-status-report-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (data) => {
  const { project, milestones, resourceBurn, revenueData, grossMargin } = data;

  const workbook = XLSX.utils.book_new();

  const projectSheet = XLSX.utils.json_to_sheet(prepareProjectData(project));
  XLSX.utils.book_append_sheet(workbook, projectSheet, 'Project Info');

  const milestonesSheet = XLSX.utils.json_to_sheet(prepareMilestonesData(milestones));
  XLSX.utils.book_append_sheet(workbook, milestonesSheet, 'Milestones');

  const resourceBurnSheet = XLSX.utils.json_to_sheet(prepareResourceBurnData(resourceBurn));
  XLSX.utils.book_append_sheet(workbook, resourceBurnSheet, 'Resource Burn');

  const revenueSheet = XLSX.utils.json_to_sheet(prepareRevenueData(revenueData));
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Revenue');

  const grossMarginSheet = XLSX.utils.json_to_sheet(prepareGrossMarginData(grossMargin));
  XLSX.utils.book_append_sheet(workbook, grossMarginSheet, 'Gross Margin');

  const fileName = `project-status-report-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const parseProjectRow = (row) => {
  return {
    name: row['Project Name'] || '',
    description: row['Description'] || '',
    startDate: parseDate(row['Start Date']),
    endDate: parseDate(row['End Date']),
    days: parseInt(row['Duration (Days)']) || 0,
    status: row['Status'] || 'In Progress',
    resource: parseInt(row['Resources']) || 0,
    revenue: parseCurrency(row['Revenue']) || 0,
    clientValue: parseCurrency(row['Client Value']) || 0,
  };
};

const parseMilestoneRow = (row, index, existingMilestones = []) => {
  const existing = existingMilestones[index] || {};
  return {
    id: existing.id || String(index + 1),
    name: row['Milestone Name'] || `MILESTONE ${index + 1}`,
    week: row['Week'] || `WEEK ${index + 1}`,
    expectedStartDate: parseDate(row['Expected Start Date']),
    expectedEndDate: parseDate(row['Expected End Date']),
    actualStartDate: parseDate(row['Actual Start Date']),
    actualEndDate: parseDate(row['Actual End Date']),
    progress: parseInt(row['Progress (%)']) || 0,
    budget: parseCurrency(row['Budget']) || 0,
    color: existing.color || '#90A4AE',
    tasks: existing.tasks || [],
    checkpoint: existing.checkpoint || null,
  };
};

const parseResourceBurnRow = (row) => {
  return {
    totalHours: parseInt(row['Total Hours']) || 0,
    resources: parseInt(row['Resources Allocated']) || 0,
    resourcesUtilized: parseInt(row['Resources Utilized']) || 0,
    resourcesNotUtilized: parseInt(row['Resources Not Utilized']) || 0,
    budgetConsumed: {
      value: parseCurrency(row['Budget Consumed']) || 0,
      percentage: parsePercentage(row['Budget Consumed (%)']) || 0,
    },
    monthlyBurn: {
      value: parseCurrency(row['Monthly Burn']) || 0,
      percentage: parsePercentage(row['Monthly Burn (%)']) || 0,
    },
    weeklyBurn: {
      value: parseCurrency(row['Weekly Burn']) || 0,
      percentage: parsePercentage(row['Weekly Burn (%)']) || 0,
    },
    remainingBudget: {
      value: parseCurrency(row['Remaining Budget']) || 0,
      percentage: parsePercentage(row['Remaining Budget (%)']) || 0,
    },
    totalManDays: parseInt(row['Total Man Days']) || 0,
  };
};

const parseRevenueRow = (row) => {
  return {
    invoiced: parseCurrency(row['Invoiced Amount']) || 0,
    total: parseCurrency(row['Total Revenue']) || 0,
    totalInvoiced: {
      value: parseCurrency(row['Total Invoiced']) || 0,
      date: null,
    },
    lastInvoice: {
      date: parseDate(row['Last Invoice Date']),
    },
    daysToNextInvoice: {
      days: row['Days to Next Invoice'] === 'N/A' ? null : parseInt(row['Days to Next Invoice']) || null,
      date: parseDate(row['Next Invoice Date']),
    },
  };
};

const parseGrossMarginRow = (row) => {
  return {
    percentage: parsePercentage(row['Gross Margin (%)']) || 0,
    grossMargin: { label: 'Gross Margin', value: null },
    currentBurnRate: { label: 'Current Burn Rate', value: null },
    totalCost: { label: 'Total Cost', value: null },
    chartData: {
      target: parseCurrency(row['Target']) || 0,
      actual: parseCurrency(row['Actual']) || 0,
      projection: parseCurrency(row['Projection']) || 0,
    },
  };
};

const parseCSVSections = (content) => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const sections = {};
  let currentSection = null;
  let headers = [];
  let rows = [];

  for (const line of lines) {
    if (line.startsWith('---') && line.endsWith('---')) {
      if (currentSection && rows.length > 0) {
        sections[currentSection] = rows;
      }
      currentSection = line.replace(/^-+\s*/, '').replace(/\s*-+$/, '').trim();
      headers = [];
      rows = [];
    } else if (currentSection) {
      const values = parseCSVRow(line);
      if (headers.length === 0) {
        headers = values;
      } else {
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        rows.push(row);
      }
    }
  }

  if (currentSection && rows.length > 0) {
    sections[currentSection] = rows;
  }

  return sections;
};

const parseCSVRow = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
};

export const importFromCSV = (file, existingData = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const sections = parseCSVSections(content);

        const result = {
          project: sections['PROJECT INFO']?.[0]
            ? parseProjectRow(sections['PROJECT INFO'][0])
            : existingData.project,
          milestones: sections['MILESTONES']
            ? sections['MILESTONES'].map((row, idx) =>
                parseMilestoneRow(row, idx, existingData.milestones)
              )
            : existingData.milestones,
          resourceBurn: sections['RESOURCE BURN']?.[0]
            ? parseResourceBurnRow(sections['RESOURCE BURN'][0])
            : existingData.resourceBurn,
          revenueData: sections['REVENUE']?.[0]
            ? parseRevenueRow(sections['REVENUE'][0])
            : existingData.revenueData,
          grossMargin: sections['GROSS MARGIN']?.[0]
            ? parseGrossMarginRow(sections['GROSS MARGIN'][0])
            : existingData.grossMargin,
        };

        resolve(result);
      } catch (error) {
        reject(new Error('Failed to parse CSV file: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromExcel = (file, existingData = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const result = {
          project: existingData.project,
          milestones: existingData.milestones,
          resourceBurn: existingData.resourceBurn,
          revenueData: existingData.revenueData,
          grossMargin: existingData.grossMargin,
        };

        if (workbook.SheetNames.includes('Project Info')) {
          const sheet = workbook.Sheets['Project Info'];
          const rows = XLSX.utils.sheet_to_json(sheet);
          if (rows.length > 0) {
            result.project = parseProjectRow(rows[0]);
          }
        }

        if (workbook.SheetNames.includes('Milestones')) {
          const sheet = workbook.Sheets['Milestones'];
          const rows = XLSX.utils.sheet_to_json(sheet);
          result.milestones = rows.map((row, idx) =>
            parseMilestoneRow(row, idx, existingData.milestones)
          );
        }

        if (workbook.SheetNames.includes('Resource Burn')) {
          const sheet = workbook.Sheets['Resource Burn'];
          const rows = XLSX.utils.sheet_to_json(sheet);
          if (rows.length > 0) {
            result.resourceBurn = parseResourceBurnRow(rows[0]);
          }
        }

        if (workbook.SheetNames.includes('Revenue')) {
          const sheet = workbook.Sheets['Revenue'];
          const rows = XLSX.utils.sheet_to_json(sheet);
          if (rows.length > 0) {
            result.revenueData = parseRevenueRow(rows[0]);
          }
        }

        if (workbook.SheetNames.includes('Gross Margin')) {
          const sheet = workbook.Sheets['Gross Margin'];
          const rows = XLSX.utils.sheet_to_json(sheet);
          if (rows.length > 0) {
            result.grossMargin = parseGrossMarginRow(rows[0]);
          }
        }

        resolve(result);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const importFromFile = (file, existingData = {}) => {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.csv')) {
    return importFromCSV(file, existingData);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return importFromExcel(file, existingData);
  } else {
    return Promise.reject(new Error('Unsupported file type. Please use CSV or Excel (.xlsx) files.'));
  }
};

export const importResourceAllocation = (file, sheetName = 'Monthly Resource Allocation') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames.includes(sheetName)) {
          reject(new Error(`Sheet "${sheetName}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`));
          return;
        }

        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        if (rawData.length < 2) {
          reject(new Error('Excel file is empty or has no data rows'));
          return;
        }

        const headers = rawData[0];

        const columnMap = {
          trim: headers.indexOf('TRIM'),
          projectCode: headers.indexOf('Project Code'),
          projectName: headers.indexOf('Project Name'),
          empId: headers.indexOf('Emp ID'),
          employeeName: headers.indexOf('Employee Name'),
          empType: headers.indexOf('Emp/Contractor'),
          band: headers.indexOf('Band'),
          working: headers.indexOf('Working'),
          location: headers.indexOf('Location'),
          role: headers.indexOf('Role'),
          costPerMonth: headers.indexOf('Cost Per Month'),
          totalCost: headers.indexOf('Total Cost'),
        };

        const monthColumns = [];
        for (let i = columnMap.costPerMonth + 1; i < columnMap.totalCost; i++) {
          monthColumns.push(i);
        }

        const resources = [];
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];

          if (!row || row.length === 0 || !row[columnMap.employeeName]) {
            continue;
          }

          const resource = {
            trim: row[columnMap.trim] || '',
            projectCode: row[columnMap.projectCode] || '',
            projectName: row[columnMap.projectName] || '',
            empId: row[columnMap.empId] || '',
            employeeName: row[columnMap.employeeName] || '',
            empType: row[columnMap.empType] || '',
            band: row[columnMap.band] || '',
            working: row[columnMap.working] || '',
            location: row[columnMap.location] || '',
            role: row[columnMap.role] || '',
            costPerMonth: parseFloat(row[columnMap.costPerMonth]) || 0,
            totalCost: parseFloat(row[columnMap.totalCost]) || 0,
          };

          monthColumns.forEach((colIdx, monthIdx) => {
            const value = row[colIdx];
            resource[`month${monthIdx}`] = value ? parseFloat(value) : 0;
          });

          resources.push(resource);
        }

        resolve(resources);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};
