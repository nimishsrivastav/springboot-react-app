export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  summary?: string;
  status: PostStatus;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  commentCount: number;
}

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorEmail?: string;
  blogPostId: number;
  createdAt: string;
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  author: string;
  summary?: string;
  status: PostStatus;
  tags: string[];
}

export interface CreateCommentRequest {
  content: string;
  authorName: string;
  authorEmail?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ValidationError {
  status: number;
  message: string;
  timestamp: string;
  errors: Record<string, string>;
}