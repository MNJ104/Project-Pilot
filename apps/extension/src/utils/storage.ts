import { ExtensionProject } from '../types/extension';

const DEFAULT_BACKEND_URL = 'http://localhost:8080/api/v1';

export const storage = {
  // Session Storage (JWT Tokens)
  getToken: async (): Promise<string | null> => {
    try {
      if (chrome?.storage?.session) {
        const result = await chrome.storage.session.get('pilot_token');
        if (result.pilot_token) return result.pilot_token;
      }
      // Fallback to local storage
      const localResult = await chrome.storage.local.get('pilot_token');
      return localResult.pilot_token || null;
    } catch {
      return null;
    }
  },

  setToken: async (token: string): Promise<void> => {
    if (chrome?.storage?.session) {
      await chrome.storage.session.set({ pilot_token: token });
    }
    await chrome.storage.local.set({ pilot_token: token });
  },

  clearToken: async (): Promise<void> => {
    if (chrome?.storage?.session) {
      await chrome.storage.session.remove('pilot_token');
    }
    await chrome.storage.local.remove('pilot_token');
  },

  // Active Project Storage
  getActiveProjectId: async (): Promise<string | null> => {
    try {
      const result = await chrome.storage.sync.get('pilot_active_project_id');
      return result.pilot_active_project_id || null;
    } catch {
      return null;
    }
  },

  setActiveProjectId: async (projectId: string): Promise<void> => {
    await chrome.storage.sync.set({ pilot_active_project_id: projectId });
  },

  // Projects List Cache
  getCachedProjects: async (): Promise<ExtensionProject[]> => {
    try {
      const result = await chrome.storage.local.get('pilot_projects');
      return result.pilot_projects || [];
    } catch {
      return [];
    }
  },

  setCachedProjects: async (projects: ExtensionProject[]): Promise<void> => {
    await chrome.storage.local.set({ pilot_projects: projects });
  },

  // Backend API URL Storage
  getBackendUrl: async (): Promise<string> => {
    try {
      const result = await chrome.storage.sync.get('pilot_backend_url');
      return result.pilot_backend_url || DEFAULT_BACKEND_URL;
    } catch {
      return DEFAULT_BACKEND_URL;
    }
  },

  setBackendUrl: async (url: string): Promise<void> => {
    await chrome.storage.sync.set({ pilot_backend_url: url });
  }
};
