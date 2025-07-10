package com.blogpostapp.backend.controller;

import com.blogpostapp.backend.dto.BlogPostDto;
import com.blogpostapp.backend.dto.CreateBlogPostRequest;
import com.blogpostapp.backend.entity.BlogPost;
import com.blogpostapp.backend.service.interfaces.BlogPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@Tag(name = "Blog Posts", description = "Blog post management API")
public class BlogPostController {
    
    private final BlogPostService blogPostService;
    
    @Autowired
    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }
    
    @GetMapping
    @Operation(summary = "Get all blog posts", description = "Retrieve all blog posts with pagination")
    public ResponseEntity<Page<BlogPostDto>> getAllPosts(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BlogPostDto> posts = blogPostService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/published")
    @Operation(summary = "Get published blog posts", description = "Retrieve only published blog posts")
    public ResponseEntity<Page<BlogPostDto>> getPublishedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BlogPostDto> posts = blogPostService.getPublishedPosts(pageable);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get blog post by ID", description = "Retrieve a specific blog post by its ID")
    public ResponseEntity<BlogPostDto> getPostById(@PathVariable Long id) {
        return blogPostService.getPostById(id)
                .map(post -> {
                    // Increment view count when post is accessed
                    blogPostService.incrementViewCount(id);
                    return ResponseEntity.ok(post);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get blog post by slug", description = "Retrieve a blog post by its slug")
    public ResponseEntity<BlogPostDto> getPostBySlug(@PathVariable String slug) {
        return blogPostService.getPostBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/author/{author}")
    @Operation(summary = "Get posts by author", description = "Retrieve blog posts by author name")
    public ResponseEntity<Page<BlogPostDto>> getPostsByAuthor(
            @PathVariable String author,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BlogPostDto> posts = blogPostService.getPostsByAuthor(author, pageable);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search blog posts", description = "Search blog posts by keyword in title or content")
    public ResponseEntity<Page<BlogPostDto>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BlogPostDto> posts = blogPostService.searchPosts(keyword, pageable);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/tags")
    @Operation(summary = "Get posts by tags", description = "Retrieve blog posts that contain specified tags")
    public ResponseEntity<Page<BlogPostDto>> getPostsByTags(
            @RequestParam List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BlogPostDto> posts = blogPostService.getPostsByTags(tags, pageable);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/tags/all")
    @Operation(summary = "Get all tags", description = "Retrieve all available tags from published posts")
    public ResponseEntity<List<String>> getAllTags() {
        List<String> tags = blogPostService.getAllTags();
        return ResponseEntity.ok(tags);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get posts by status", description = "Retrieve blog posts by their status")
    public ResponseEntity<Page<BlogPostDto>> getPostsByStatus(
            @PathVariable BlogPost.PostStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BlogPostDto> posts = blogPostService.getPostsByStatus(status, pageable);
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping
    @Operation(summary = "Create blog post", description = "Create a new blog post")
    public ResponseEntity<BlogPostDto> createPost(@Valid @RequestBody CreateBlogPostRequest request) {
        BlogPostDto createdPost = blogPostService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update blog post", description = "Update an existing blog post")
    public ResponseEntity<BlogPostDto> updatePost(
            @PathVariable Long id, 
            @Valid @RequestBody BlogPostDto postDto) {
        BlogPostDto updatedPost = blogPostService.updatePost(id, postDto);
        return ResponseEntity.ok(updatedPost);
    }
    
    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish blog post", description = "Change post status to PUBLISHED")
    public ResponseEntity<BlogPostDto> publishPost(@PathVariable Long id) {
        BlogPostDto publishedPost = blogPostService.publishPost(id);
        return ResponseEntity.ok(publishedPost);
    }
    
    @PatchMapping("/{id}/archive")
    @Operation(summary = "Archive blog post", description = "Change post status to ARCHIVED")
    public ResponseEntity<BlogPostDto> archivePost(@PathVariable Long id) {
        BlogPostDto archivedPost = blogPostService.archivePost(id);
        return ResponseEntity.ok(archivedPost);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete blog post", description = "Delete a blog post permanently")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats/count")
    @Operation(summary = "Get post count by status", description = "Get the number of posts by status")
    public ResponseEntity<Long> getPostCount(@RequestParam BlogPost.PostStatus status) {
        long count = blogPostService.getPostCount(status);
        return ResponseEntity.ok(count);
    }
}