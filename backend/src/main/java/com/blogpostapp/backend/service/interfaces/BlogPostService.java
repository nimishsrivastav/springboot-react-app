package com.blogpostapp.backend.service.interfaces;

import com.blogpostapp.backend.dto.BlogPostDto;
import com.blogpostapp.backend.dto.CreateBlogPostRequest;
import com.blogpostapp.backend.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface BlogPostService {
    Page<BlogPostDto> getAllPosts(Pageable pageable);
    Page<BlogPostDto> getPublishedPosts(Pageable pageable);
    Optional<BlogPostDto> getPostById(Long id);
    Optional<BlogPostDto> getPostBySlug(String slug);
    Page<BlogPostDto> getPostsByAuthor(String author, Pageable pageable);
    Page<BlogPostDto> searchPosts(String keyword, Pageable pageable);
    Page<BlogPostDto> getPostsByTags(List<String> tags, Pageable pageable);
    Page<BlogPostDto> getPostsByStatus(BlogPost.PostStatus status, Pageable pageable);
    List<String> getAllTags();
    BlogPostDto createPost(CreateBlogPostRequest request);
    BlogPostDto updatePost(Long id, BlogPostDto postDto);
    BlogPostDto publishPost(Long id);
    BlogPostDto archivePost(Long id);
    void deletePost(Long id);
    BlogPostDto incrementViewCount(Long id);
    long getPostCount(BlogPost.PostStatus status);
}