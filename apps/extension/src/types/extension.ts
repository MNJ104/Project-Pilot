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

export interface ExtensionProject {
  id: string;
  title: string;
  description?: string;
}

export type ExtensionMessageType =
  | 'ANALYZE_PAGE'
  | 'CAPTURE_SELECTION'
  | 'EXTRACT_PAGE_RESPONSE'
  | 'SAVE_SOURCE_TO_BACKEND'
  | 'GET_AUTH_STATE'
  | 'SET_AUTH_STATE'
  | 'GET_PROJECTS'
  | 'SET_ACTIVE_PROJECT';

export interface ExtensionMessage {
  type: ExtensionMessageType;
  payload?: any;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
