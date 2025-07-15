package com.blogpostapp.backend;

import com.blogpostapp.backend.controller.BlogPostController;
import com.blogpostapp.backend.dto.BlogPostDto;
import com.blogpostapp.backend.dto.CreateBlogPostRequest;
import com.blogpostapp.backend.entity.BlogPost;
import com.blogpostapp.backend.service.interfaces.BlogPostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BlogPostController.class)
class BlogPostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BlogPostService blogPostService;

    @Autowired
    private ObjectMapper objectMapper;

    private BlogPostDto sampleBlogPost;
    private CreateBlogPostRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleBlogPost = new BlogPostDto();
        sampleBlogPost.setId(1L);
        sampleBlogPost.setTitle("Test Blog Post");
        sampleBlogPost.setSlug("test-blog-post");
        sampleBlogPost.setContent("This is a test blog post content");
        sampleBlogPost.setAuthor("John Doe");
        sampleBlogPost.setSummary("Test summary");
        sampleBlogPost.setStatus(BlogPost.PostStatus.PUBLISHED);
        sampleBlogPost.setTags(Set.of("technology", "java"));
        sampleBlogPost.setViewCount(10L);
        sampleBlogPost.setCreatedAt(LocalDateTime.now());
        sampleBlogPost.setCommentCount(5);

        sampleRequest = new CreateBlogPostRequest();
        sampleRequest.setTitle("New Blog Post");
        sampleRequest.setContent("This is new content for testing");
        sampleRequest.setAuthor("Jane Smith");
        sampleRequest.setSummary("New summary");
        sampleRequest.setTags(Set.of("testing", "spring"));
    }

    @Test
    void getAllPosts_ShouldReturnPagedPosts() throws Exception {
        // Given
        Page<BlogPostDto> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostService.getAllPosts(any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/posts")
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "createdAt")
                .param("sortDir", "desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Blog Post"))
                .andExpect(jsonPath("$.content[0].author").value("John Doe"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(blogPostService).getAllPosts(any(Pageable.class));
    }

    @Test
    void getAllPosts_WithInvalidSortDirection_ShouldUseAscending() throws Exception {
        // Given
        Page<BlogPostDto> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostService.getAllPosts(any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/posts")
                .param("sortDir", "invalid"))
                .andExpect(status().isOk());

        verify(blogPostService).getAllPosts(any(Pageable.class));
    }

    @Test
    void getPostById_ValidId_ShouldReturnPost() throws Exception {
        // Given
        when(blogPostService.getPostById(1L)).thenReturn(Optional.of(sampleBlogPost));

        // When & Then
        mockMvc.perform(get("/api/v1/posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Blog Post"))
                .andExpect(jsonPath("$.author").value("John Doe"))
                .andExpect(jsonPath("$.viewCount").value(10));

        verify(blogPostService).getPostById(1L);
    }

    @Test
    void getPostById_InvalidId_ShouldReturn404() throws Exception {
        // Given
        when(blogPostService.getPostById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/v1/posts/999"))
                .andExpect(status().isNotFound());

        verify(blogPostService).getPostById(999L);
    }

    @Test
    void createPost_ValidRequest_ShouldReturnCreatedPost() throws Exception {
        // Given
        when(blogPostService.createPost(any(CreateBlogPostRequest.class))).thenReturn(sampleBlogPost);

        // When & Then
        mockMvc.perform(post("/api/v1/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Blog Post"))
                .andExpect(jsonPath("$.author").value("John Doe"));

        verify(blogPostService).createPost(any(CreateBlogPostRequest.class));
    }

    @Test
    void createPost_InvalidTitle_ShouldReturnBadRequest() throws Exception {
        // Given
        sampleRequest.setTitle("Bad"); // Too short (< 5 characters)

        // When & Then
        mockMvc.perform(post("/api/v1/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isBadRequest());

        verify(blogPostService, never()).createPost(any(CreateBlogPostRequest.class));
    }

    @Test
    void createPost_MissingRequiredFields_ShouldReturnBadRequest() throws Exception {
        // Given
        sampleRequest.setTitle(null);
        sampleRequest.setContent(null);
        sampleRequest.setAuthor(null);

        // When & Then
        mockMvc.perform(post("/api/v1/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isBadRequest());

        verify(blogPostService, never()).createPost(any(CreateBlogPostRequest.class));
    }

    @Test
    void updatePost_ValidRequest_ShouldReturnUpdatedPost() throws Exception {
        // Given
        when(blogPostService.updatePost(eq(1L), any(BlogPostDto.class))).thenReturn(sampleBlogPost);

        // When & Then
        mockMvc.perform(put("/api/v1/posts/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleBlogPost)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Blog Post"));

        verify(blogPostService).updatePost(eq(1L), any(BlogPostDto.class));
    }

    @Test
    void publishPost_ValidId_ShouldReturnPublishedPost() throws Exception {
        // Given
        sampleBlogPost.setStatus(BlogPost.PostStatus.PUBLISHED);
        when(blogPostService.publishPost(1L)).thenReturn(sampleBlogPost);

        // When & Then
        mockMvc.perform(patch("/api/v1/posts/1/publish"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PUBLISHED"));

        verify(blogPostService).publishPost(1L);
    }

    @Test
    void archivePost_ValidId_ShouldReturnArchivedPost() throws Exception {
        // Given
        sampleBlogPost.setStatus(BlogPost.PostStatus.ARCHIVED);
        when(blogPostService.archivePost(1L)).thenReturn(sampleBlogPost);

        // When & Then
        mockMvc.perform(patch("/api/v1/posts/1/archive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));

        verify(blogPostService).archivePost(1L);
    }

    @Test
    void deletePost_ValidId_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(blogPostService).deletePost(1L);

        // When & Then
        mockMvc.perform(delete("/api/v1/posts/1"))
                .andExpect(status().isNoContent());

        verify(blogPostService).deletePost(1L);
    }

    @Test
    void getPublishedPosts_ShouldReturnOnlyPublishedPosts() throws Exception {
        // Given
        Page<BlogPostDto> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostService.getPublishedPosts(any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/posts/published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].status").value("PUBLISHED"));

        verify(blogPostService).getPublishedPosts(any(Pageable.class));
    }

    @Test
    void getPostBySlug_ValidSlug_ShouldReturnPost() throws Exception {
        // Given
        when(blogPostService.getPostBySlug("test-blog-post")).thenReturn(Optional.of(sampleBlogPost));

        // When & Then
        mockMvc.perform(get("/api/v1/posts/slug/test-blog-post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("test-blog-post"));

        verify(blogPostService).getPostBySlug("test-blog-post");
    }

    @Test
    void getPostBySlug_InvalidSlug_ShouldReturn404() throws Exception {
        // Given
        when(blogPostService.getPostBySlug("invalid-slug")).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/v1/posts/slug/invalid-slug"))
                .andExpect(status().isNotFound());

        verify(blogPostService).getPostBySlug("invalid-slug");
    }

    @Test
    void searchPosts_WithKeyword_ShouldReturnMatchingPosts() throws Exception {
        // Given
        Page<BlogPostDto> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostService.searchPosts(eq("test"), any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/posts/search")
                .param("keyword", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Blog Post"));

        verify(blogPostService).searchPosts(eq("test"), any(Pageable.class));
    }

    @Test
    void getPostsByTags_WithValidTags_ShouldReturnFilteredPosts() throws Exception {
        // Given
        Page<BlogPostDto> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostService.getPostsByTags(anyList(), any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/posts/tags")
                .param("tags", "java,technology"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].tags").isArray());

        verify(blogPostService).getPostsByTags(anyList(), any(Pageable.class));
    }

    @Test
    void getPostsByAuthor_ValidAuthor_ShouldReturnAuthorPosts() throws Exception {
        // Given
        Page<BlogPostDto> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostService.getPostsByAuthor(eq("John Doe"), any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/posts/author/John Doe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].author").value("John Doe"));

        verify(blogPostService).getPostsByAuthor(eq("John Doe"), any(Pageable.class));
    }

    @Test
    void getPostsByStatus_ValidStatus_ShouldReturnFilteredPosts() throws Exception {
        // Given
        Page<BlogPostDto> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostService.getPostsByStatus(eq(BlogPost.PostStatus.PUBLISHED), any(Pageable.class)))
                .thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/posts/status/PUBLISHED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].status").value("PUBLISHED"));

        verify(blogPostService).getPostsByStatus(eq(BlogPost.PostStatus.PUBLISHED), any(Pageable.class));
    }

    @Test
    void getAllTags_ShouldReturnAllUniqueTags() throws Exception {
        // Given
        List<String> tags = List.of("java", "spring", "technology", "testing");
        when(blogPostService.getAllTags()).thenReturn(tags);

        // When & Then
        mockMvc.perform(get("/api/v1/posts/tags/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(4));

        verify(blogPostService).getAllTags();
    }

    @Test
    void getPostCount_ValidStatus_ShouldReturnCount() throws Exception {
        // Given
        when(blogPostService.getPostCount(BlogPost.PostStatus.PUBLISHED)).thenReturn(5L);

        // When & Then
        mockMvc.perform(get("/api/v1/posts/stats/count")
                .param("status", "PUBLISHED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(5));

        verify(blogPostService).getPostCount(BlogPost.PostStatus.PUBLISHED);
    }
}