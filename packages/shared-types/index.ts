// User & Auth Types
export enum Role {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  TESTER = 'TESTER',
  CLIENT = 'CLIENT',
  RESEARCHER = 'RESEARCHER',
  STUDENT = 'STUDENT'
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: Role[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInMs: number;
  user: UserDto;
}

export interface ErrorResponse {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  timestamp: string;
  errors?: Record<string, string>;
}

// Health check status
export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// Project Types
export interface ProjectDto {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  status: string;
  healthScore: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

// Extension & Content Extraction Types
export type SourceType = 'WEBSITE' | 'GITHUB' | 'DOCUMENTATION' | 'FIGMA' | 'BLOG_ARTICLE' | 'PRODUCT_PAGE' | 'MANUAL';

export interface HeadingItem {
  level: number;
  text: string;
}

export interface LinkItem {
  text: string;
  href: string;
}

export interface CodeBlockItem {
  language?: string;
  code: string;
}

export interface ExtractionPayload {
  url: string;
  pageTitle: string;
  metaDescription?: string;
  headings: HeadingItem[];
  mainReadableText: string;
  relevantLinks: LinkItem[];
  codeBlocks: CodeBlockItem[];
  selectedText?: string;
  sourceType: SourceType;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface IngestSourceDto {
  projectId: string;
  sourceType: SourceType;
  url: string;
  title: string;
  rawContent: string;
  normalizedContent?: string;
  metadata?: Record<string, any>;
}

export interface SourceResponseDto {
  id: string;
  projectId: string;
  sourceType: SourceType;
  url: string;
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
