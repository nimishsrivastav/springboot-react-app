package com.blogpostapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 500, message = "Comment must be between 1 and 500 characters")
    private String content;
    
    @NotBlank(message = "Author name is required")
    @Size(min = 2, max = 50, message = "Author name must be between 2 and 50 characters")
    private String authorName;
    
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String authorEmail;
    
    private Long blogPostId;
    private LocalDateTime createdAt;
    
    // Constructors
    public CommentDto() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    
    public String getAuthorEmail() { return authorEmail; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }
    
    public Long getBlogPostId() { return blogPostId; }
    public void setBlogPostId(Long blogPostId) { this.blogPostId = blogPostId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
