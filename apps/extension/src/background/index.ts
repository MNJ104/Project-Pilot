import { storage } from '../utils/storage';
import { ExtensionMessage, MessageResponse, ExtractionPayload } from '../types/extension';

console.log('[Project Pilot] Background Service Worker initialized.');

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Project Pilot] Extension installed.');
});

// Listener for background messages from Popup or Content Script
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === 'SAVE_SOURCE_TO_BACKEND') {
    handleSaveSource(message.payload)
      .then(res => sendResponse(res))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async response
  }

  if (message.type === 'GET_PROJECTS') {
    handleGetProjects()
      .then(res => sendResponse(res))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === 'GET_AUTH_STATE') {
    storage.getToken().then(token => {
      sendResponse({ success: true, data: { isAuthenticated: !!token } });
    });
    return true;
  }
});

async function handleSaveSource(payload: { projectId?: string; extraction: ExtractionPayload }): Promise<MessageResponse> {
  const token = await storage.getToken();
  if (!token) {
    return { success: false, error: 'User is not authenticated. Please log in first via the dashboard or extension popup.' };
  }

  const backendUrl = await storage.getBackendUrl();
  const activeProjectId = payload.projectId || (await storage.getActiveProjectId());

  const ingestData = {
    projectId: activeProjectId,
    sourceType: payload.extraction.sourceType,
    url: payload.extraction.url,
    title: payload.extraction.pageTitle,
    rawContent: payload.extraction.mainReadableText,
    normalizedContent: payload.extraction.mainReadableText,
    metadata: {
      metaDescription: payload.extraction.metaDescription,
      headings: payload.extraction.headings,
      relevantLinks: payload.extraction.relevantLinks,
      codeBlocks: payload.extraction.codeBlocks,
      selectedText: payload.extraction.selectedText,
      timestamp: payload.extraction.timestamp,
      ...(payload.extraction.metadata || {})
    }
  };

  try {
    const response = await fetch(`${backendUrl}/sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ingestData)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({ detail: response.statusText }));
      return { success: false, error: errorJson.detail || errorJson.title || `Server error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: `Failed to connect to backend service at ${backendUrl}: ${err.message}` };
  }
}

async function handleGetProjects(): Promise<MessageResponse> {
  const token = await storage.getToken();
  if (!token) {
    return { success: false, error: 'Unauthenticated' };
  }

  const backendUrl = await storage.getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const projects = await response.json();
    if (Array.isArray(projects) && projects.length > 0) {
      await storage.setCachedProjects(projects);
      const activeId = await storage.getActiveProjectId();
      if (!activeId) {
        await storage.setActiveProjectId(projects[0].id);
      }
    }
    return { success: true, data: projects };
  } catch (err: any) {
    // Return cached projects if network fails
    const cached = await storage.getCachedProjects();
    return { success: true, data: cached };
  }
}
