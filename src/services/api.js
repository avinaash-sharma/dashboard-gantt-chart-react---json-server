const API_BASE_URL = 'http://localhost:3001';

export const api = {
  // Milestones
  getMilestones: async () => {
    const response = await fetch(`${API_BASE_URL}/milestones`);
    if (!response.ok) throw new Error('Failed to fetch milestones');
    return response.json();
  },

  getMilestone: async (id) => {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`);
    if (!response.ok) throw new Error('Failed to fetch milestone');
    return response.json();
  },

  createMilestone: async (milestone) => {
    const response = await fetch(`${API_BASE_URL}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone),
    });
    if (!response.ok) throw new Error('Failed to create milestone');
    return response.json();
  },

  updateMilestone: async (id, milestone) => {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone),
    });
    if (!response.ok) throw new Error('Failed to update milestone');
    return response.json();
  },

  deleteMilestone: async (id) => {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete milestone');
  },

  // Project data
  getProject: async () => {
    const response = await fetch(`${API_BASE_URL}/project`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  updateProject: async (project) => {
    const response = await fetch(`${API_BASE_URL}/project`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  // Resource Burn
  getResourceBurn: async () => {
    const response = await fetch(`${API_BASE_URL}/resourceBurn`);
    if (!response.ok) throw new Error('Failed to fetch resource burn');
    return response.json();
  },

  // Revenue Data
  getRevenueData: async () => {
    const response = await fetch(`${API_BASE_URL}/revenueData`);
    if (!response.ok) throw new Error('Failed to fetch revenue data');
    return response.json();
  },

  // Gross Margin
  getGrossMargin: async () => {
    const response = await fetch(`${API_BASE_URL}/grossMargin`);
    if (!response.ok) throw new Error('Failed to fetch gross margin');
    return response.json();
  },

  // Fetch all data at once
  getAllData: async () => {
    const [project, milestones, resourceBurn, revenueData, grossMargin] = await Promise.all([
      api.getProject(),
      api.getMilestones(),
      api.getResourceBurn(),
      api.getRevenueData(),
      api.getGrossMargin(),
    ]);
    return { project, milestones, resourceBurn, revenueData, grossMargin };
  },
};
