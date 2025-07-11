import axios from 'axios';
import { 
  BlogPost, 
  Comment, 
  CreateBlogPostRequest, 
  CreateCommentRequest, 
  PaginatedResponse, 
  PostStatus 
} from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog Posts API
export const blogPostService = {
  // Get all posts with pagination
  getAllPosts: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<PaginatedResponse<BlogPost>> => {
    const response = await api.get('/posts', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get published posts
  getPublishedPosts: async (page = 0, size = 10): Promise<PaginatedResponse<BlogPost>> => {
    const response = await api.get('/posts/published', {
      params: { page, size }
    });
    return response.data;
  },

  // Get post by ID
  getPostById: async (id: number): Promise<BlogPost> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Get post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await api.get(`/posts/slug/${slug}`);
    return response.data;
  },

  // Get posts by author
  getPostsByAuthor: async (author: string, page = 0, size = 10): Promise<PaginatedResponse<BlogPost>> => {
    const response = await api.get(`/posts/author/${author}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Search posts
  searchPosts: async (keyword: string, page = 0, size = 10): Promise<PaginatedResponse<BlogPost>> => {
    const response = await api.get('/posts/search', {
      params: { keyword, page, size }
    });
    return response.data;
  },

  // Get posts by tags
  getPostsByTags: async (tags: string[], page = 0, size = 10): Promise<PaginatedResponse<BlogPost>> => {
    const response = await api.get('/posts/tags', {
      params: { tags: tags.join(','), page, size }
    });
    return response.data;
  },

  // Get all tags
  getAllTags: async (): Promise<string[]> => {
    const response = await api.get('/posts/tags/all');
    return response.data;
  },

  // Get posts by status
  getPostsByStatus: async (status: PostStatus, page = 0, size = 10): Promise<PaginatedResponse<BlogPost>> => {
    const response = await api.get(`/posts/status/${status}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Create post
  createPost: async (post: CreateBlogPostRequest): Promise<BlogPost> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  // Update post
  updatePost: async (id: number, post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  // Publish post
  publishPost: async (id: number): Promise<BlogPost> => {
    const response = await api.patch(`/posts/${id}/publish`);
    return response.data;
  },

  // Archive post
  archivePost: async (id: number): Promise<BlogPost> => {
    const response = await api.patch(`/posts/${id}/archive`);
    return response.data;
  },

  // Delete post
  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  // Get post count by status
  getPostCount: async (status: PostStatus): Promise<number> => {
    const response = await api.get('/posts/stats/count', {
      params: { status }
    });
    return response.data;
  }
};

// Comments API
export const commentService = {
  // Get comments by post ID
  getCommentsByPostId: async (postId: number, page = 0, size = 10): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get(`/comments/post/${postId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get comment by ID
  getCommentById: async (id: number): Promise<Comment> => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  // Create comment
  createComment: async (postId: number, comment: CreateCommentRequest): Promise<Comment> => {
    const response = await api.post(`/comments/post/${postId}`, comment);
    return response.data;
  },

  // Update comment
  updateComment: async (id: number, comment: Partial<Comment>): Promise<Comment> => {
    const response = await api.put(`/comments/${id}`, comment);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  // Get comment count
  getCommentCount: async (postId: number): Promise<number> => {
    const response = await api.get(`/comments/post/${postId}/count`);
    return response.data;
  }
};

export default api;