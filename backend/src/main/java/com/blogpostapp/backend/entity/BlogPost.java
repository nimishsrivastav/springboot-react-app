package com.blogpostapp.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "blog_posts", indexes = {
    @Index(name = "idx_blog_post_status", columnList = "status"),
    @Index(name = "idx_blog_post_author", columnList = "author"),
    @Index(name = "idx_blog_post_created_at", columnList = "created_at")
})
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    @Column(nullable = false)
    private String title;
    
    @Column(unique = true, nullable = false)
    private String slug;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, message = "Content must be at least 10 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @NotBlank(message = "Author is required")
    @Size(min = 2, max = 50, message = "Author name must be between 2 and 50 characters")
    @Column(nullable = false)
    private String author;
    
    @Size(max = 200, message = "Summary cannot exceed 200 characters")
    private String summary;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status = PostStatus.DRAFT;
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "blog_post_tags", joinColumns = @JoinColumn(name = "blog_post_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
    
    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Comment> comments = new HashSet<>();
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    public enum PostStatus {
        DRAFT, PUBLISHED, ARCHIVED
    }
    
    // Constructors
    public BlogPost() {}
    
    public BlogPost(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.slug = generateSlug(title);
    }
    
    // Helper method to generate slug from title
    private String generateSlug(String title) {
        return title.toLowerCase()
                   .replaceAll("[^a-z0-9\\s]", "")
                   .replaceAll("\\s+", "-")
                   .replaceAll("-+", "-")
                   .replaceAll("^-|-$", "");
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { 
        this.title = title;
        if (title != null) {
            this.slug = generateSlug(title);
        }
    }
    
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public PostStatus getStatus() { return status; }
    public void setStatus(PostStatus status) { 
        this.status = status;
        if (status == PostStatus.PUBLISHED && publishedAt == null) {
            this.publishedAt = LocalDateTime.now();
        }
    }
    
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
    
    public Set<Comment> getComments() { return comments; }
    public void setComments(Set<Comment> comments) { this.comments = comments; }
    
    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    
    public void incrementViewCount() {
        this.viewCount++;
    }
}