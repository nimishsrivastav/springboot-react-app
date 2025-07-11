import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogPostService, commentService } from '../services/api';
import { PostStatus, CreateBlogPostRequest, CreateCommentRequest } from '../types';

// Blog Post Hooks
export const useBlogPosts = (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
  return useQuery({
    queryKey: ['blogPosts', page, size, sortBy, sortDir],
    queryFn: () => blogPostService.getAllPosts(page, size, sortBy, sortDir),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePublishedPosts = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['publishedPosts', page, size],
    queryFn: () => blogPostService.getPublishedPosts(page, size),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogPost = (id: number) => {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => blogPostService.getPostById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blogPost', 'slug', slug],
    queryFn: () => blogPostService.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSearchPosts = (keyword: string, page = 0, size = 10) => {
  return useQuery({
    queryKey: ['searchPosts', keyword, page, size],
    queryFn: () => blogPostService.searchPosts(keyword, page, size),
    enabled: !!keyword,
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePostsByAuthor = (author: string, page = 0, size = 10) => {
  return useQuery({
    queryKey: ['postsByAuthor', author, page, size],
    queryFn: () => blogPostService.getPostsByAuthor(author, page, size),
    enabled: !!author,
    placeholderData: (prev) => prev,
  });
};

export const usePostsByTags = (tags: string[], page = 0, size = 10) => {
  return useQuery({
    queryKey: ['postsByTags', tags, page, size],
    queryFn: () => blogPostService.getPostsByTags(tags, page, size),
    enabled: tags.length > 0,
    placeholderData: (prev) => prev,
  });
};

export const useAllTags = () => {
  return useQuery({
    queryKey: ['allTags'],
    queryFn: blogPostService.getAllTags,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const usePostsByStatus = (status: PostStatus, page = 0, size = 10) => {
  return useQuery({
    queryKey: ['postsByStatus', status, page, size],
    queryFn: () => blogPostService.getPostsByStatus(status, page, size),
    placeholderData: (prev) => prev,
  });
};

// Blog Post Mutations
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (post: CreateBlogPostRequest) => blogPostService.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allTags'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<CreateBlogPostRequest> }) =>
      blogPostService.updatePost(id, post),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', data.id] });
      queryClient.invalidateQueries({ queryKey: ['allTags'] });
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => blogPostService.publishPost(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', data.id] });
    },
  });
};

export const useArchivePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => blogPostService.archivePost(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', data.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => blogPostService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allTags'] });
    },
  });
};

// Comment Hooks
export const useComments = (postId: number, page = 0, size = 10) => {
  return useQuery({
    queryKey: ['comments', postId, page, size],
    queryFn: () => commentService.getCommentsByPostId(postId, page, size),
    enabled: !!postId,
    placeholderData: (prev) => prev,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, comment }: { postId: number; comment: CreateCommentRequest }) =>
      commentService.createComment(postId, comment),
    onSuccess: (_: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.postId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => commentService.deleteComment(id),
    onSuccess: (_: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.postId] });
    },
  });
};