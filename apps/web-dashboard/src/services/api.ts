import type {
  ArchitectureDto,
  DatabaseDesignDto,
  ApiEndpointDto,
  TechStackItemDto,
  SprintDto,
  CostEstimateDto,
  RiskItemDto,
  AllArtifactsDto,
  ChatMessageDto,
  ChatResponseDto,
} from '../types/ai-types';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1';

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInMs: number;
  user: UserDto;
}

export interface ProjectDto {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  status: string;
  healthScore: number;
  createdAt: string;
}

export interface SourceResponseDto {
  id: string;
  projectId: string;
  sourceType: string;
  url?: string;
  title: string;
  contentHash: string;
  createdAt: string;
  summaryPreview?: string;
  detectedDomain?: string;
  requirementsCount?: number;
  featuresCount?: number;
  complexityScore?: string;
  feasibilityRating?: string;
  suggestedNextStep?: string;
}

export interface SourceDetailDto extends SourceResponseDto {
  rawContent: string;
  normalizedContent?: string;
  metadata?: Record<string, any>;
}

export interface ErrorDetails {
  title: string;
  detail: string;
  status: number;
  errors?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  details: ErrorDetails;

  constructor(status: number, details: ErrorDetails) {
    super(details.detail || details.title || 'An API error occurred');
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('pilot_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ErrorDetails;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        title: 'Error',
        detail: `HTTP error ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    if (response.status === 401) {
      localStorage.removeItem('pilot_token');
      localStorage.removeItem('pilot_user');
    }

    throw new ApiError(response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password: String; fullName: string; role?: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: String }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () => request<UserDto>('/auth/me'),

  // Projects
  getProjects: () => request<ProjectDto[]>('/projects'),

  createProject: (data: { title: string; description?: string }) =>
    request<ProjectDto>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteProject: (id: string) =>
    request<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),

  // Sources
  getProjectSources: (projectId: string) => request<SourceResponseDto[]>(`/sources/project/${projectId}`),

  getSourceDetails: (sourceId: string) => request<SourceDetailDto>(`/sources/${sourceId}`),

  ingestSource: (data: {
    projectId?: string;
    sourceType: string;
    url?: string;
    title: string;
    rawContent: string;
    normalizedContent?: string;
    metadata?: Record<string, any>;
  }) =>
    request<SourceResponseDto>('/sources', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteSource: (sourceId: string) =>
    request<void>(`/sources/${sourceId}`, {
      method: 'DELETE',
    }),

  // ─── AI Generation ──────────────────────────────────────────────────
  generateArchitecture: (projectId: string) =>
    request<ArchitectureDto>(`/projects/${projectId}/generate/architecture`, { method: 'POST' }),

  generateDatabase: (projectId: string) =>
    request<DatabaseDesignDto>(`/projects/${projectId}/generate/database`, { method: 'POST' }),

  generateApiDesign: (projectId: string) =>
    request<ApiEndpointDto[]>(`/projects/${projectId}/generate/api-design`, { method: 'POST' }),

  generateTechStack: (projectId: string) =>
    request<TechStackItemDto[]>(`/projects/${projectId}/generate/tech-stack`, { method: 'POST' }),

  generateSprints: (projectId: string) =>
    request<SprintDto[]>(`/projects/${projectId}/generate/sprints`, { method: 'POST' }),

  generateCostRisk: (projectId: string) =>
    request<{ cost_estimate: CostEstimateDto; risks: RiskItemDto[] }>(
      `/projects/${projectId}/generate/cost-risk`, { method: 'POST' }),

  generateFullBlueprint: (projectId: string) =>
    request<{ status: string; message: string }>(`/projects/${projectId}/generate/all`, { method: 'POST' }),

  // ─── Artifact Retrieval ─────────────────────────────────────────────
  getAllArtifacts: (projectId: string) =>
    request<AllArtifactsDto>(`/projects/${projectId}/artifacts`),

  getArchitecture: (projectId: string) =>
    request<ArchitectureDto>(`/projects/${projectId}/architecture`),

  getDatabase: (projectId: string) =>
    request<DatabaseDesignDto>(`/projects/${projectId}/database`),

  getApiDesign: (projectId: string) =>
    request<ApiEndpointDto[]>(`/projects/${projectId}/api-design`),

  getTechStack: (projectId: string) =>
    request<TechStackItemDto[]>(`/projects/${projectId}/tech-stack`),

  getSprints: (projectId: string) =>
    request<SprintDto[]>(`/projects/${projectId}/sprints`),

  getCostRisk: (projectId: string) =>
    request<{ cost_estimate: CostEstimateDto; risks: RiskItemDto[] }>(`/projects/${projectId}/cost-risk`),

  // ─── Task Kanban ────────────────────────────────────────────────────
  updateTaskStatus: (projectId: string, taskId: string, status: string) =>
    request<{ id: string; status: string; updated: boolean }>(
      `/projects/${projectId}/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),

  // ─── Chat ────────────────────────────────────────────────────────────
  sendChatMessage: (projectId: string, messages: ChatMessageDto[]) =>
    request<ChatResponseDto>(`/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),

  // ─── Export ─────────────────────────────────────────────────────────
  exportMarkdown: (projectId: string) =>
    `${BASE_URL}/projects/${projectId}/export/markdown`,

  exportSql: (projectId: string) =>
    `${BASE_URL}/projects/${projectId}/export/sql`,

  exportOpenApi: (projectId: string) =>
    `${BASE_URL}/projects/${projectId}/export/openapi`,
};
