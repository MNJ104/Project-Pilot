// ============================================================
// AI Artifact Types
// ============================================================

export interface ArchitectureComponentDto {
  name: string;
  techStack: string;
  responsibility: string;
  communicationProtocol: string;
}

export interface ArchitectureDto {
  id?: string;
  style: string;
  summary: string;
  mermaidDiagram: string;
  deploymentStrategy?: string;
  components?: ArchitectureComponentDto[];
  createdAt?: string;
}

export interface DatabaseDesignDto {
  id?: string;
  dbType: string;
  mermaidErDiagram: string;
  migrationSql: string;
  createdAt?: string;
}

export interface ApiEndpointDto {
  id?: string;
  endpointPath: string;
  httpMethod: string;
  summary?: string;
  requestSchema?: string;
  responseSchema?: string;
  authRequired: boolean;
}

export interface TechStackItemDto {
  id?: string;
  category: string;
  technologyName: string;
  justification?: string;
}

export interface SprintTaskDto {
  id?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  storyPoints: number;
}

export interface SprintDto {
  id?: string;
  name: string;
  sprintNumber: number;
  goal?: string;
  startDate?: string;
  endDate?: string;
  tasks?: SprintTaskDto[];
  status?: string;
}

export interface CostEstimateDto {
  id?: string;
  totalMonthlyUsd: number;
  computeUsd: number;
  databaseUsd: number;
  storageUsd: number;
  aiInferenceUsd: number;
  breakdownNotes?: string;
}

export interface RiskItemDto {
  id?: string;
  category: string;
  description: string;
  probability: number;
  impact: number;
  severityScore: number;
  mitigationStrategy: string;
}

export interface AllArtifactsDto {
  architecture?: ArchitectureDto;
  database_design?: DatabaseDesignDto;
  api_endpoints?: ApiEndpointDto[];
  tech_stack?: TechStackItemDto[];
  sprints?: SprintDto[];
  cost_estimate?: CostEstimateDto;
  risks?: RiskItemDto[];
}

export interface ChatMessageDto {
  role: string;
  content: string;
}

export interface ChatResponseDto {
  reply: string;
  taxonomyTag: string;
}

