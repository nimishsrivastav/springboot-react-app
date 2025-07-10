package com.blogpostapp.backend.dto;

import com.blogpostapp.backend.entity.BlogPost;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class CreateBlogPostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, message = "Content must be at least 10 characters")
    private String content;
    
    @NotBlank(message = "Author is required")
    @Size(min = 2, max = 50, message = "Author name must be between 2 and 50 characters")
    private String author;
    
    @Size(max = 200, message = "Summary cannot exceed 200 characters")
    private String summary;
    
    private BlogPost.PostStatus status = BlogPost.PostStatus.DRAFT;
    private Set<String> tags;
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public BlogPost.PostStatus getStatus() { return status; }
    public void setStatus(BlogPost.PostStatus status) { this.status = status; }
    
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
}
