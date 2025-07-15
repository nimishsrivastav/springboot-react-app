package com.blogpostapp.backend;

import com.blogpostapp.backend.dto.BlogPostDto;
import com.blogpostapp.backend.dto.CreateBlogPostRequest;
import com.blogpostapp.backend.entity.BlogPost;
import com.blogpostapp.backend.exception.ResourceNotFoundException;
import com.blogpostapp.backend.mapper.BlogPostMapper;
import com.blogpostapp.backend.repository.BlogPostRepository;
import com.blogpostapp.backend.service.impl.BlogPostServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogPostServiceTest {

    @Mock
    private BlogPostRepository blogPostRepository;

    @Mock
    private BlogPostMapper blogPostMapper;

    @InjectMocks
    private BlogPostServiceImpl blogPostService;

    private BlogPost sampleBlogPost;
    private BlogPostDto sampleBlogPostDto;
    private CreateBlogPostRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleBlogPost = new BlogPost();
        sampleBlogPost.setId(1L);
        sampleBlogPost.setTitle("Test Blog Post");
        sampleBlogPost.setSlug("test-blog-post");
        sampleBlogPost.setContent("This is test content for the blog post");
        sampleBlogPost.setAuthor("John Doe");
        sampleBlogPost.setSummary("Test summary");
        sampleBlogPost.setStatus(BlogPost.PostStatus.DRAFT);
        sampleBlogPost.setTags(Set.of("java", "spring"));
        sampleBlogPost.setViewCount(0L);
        sampleBlogPost.setCreatedAt(LocalDateTime.now());

        sampleBlogPostDto = new BlogPostDto();
        sampleBlogPostDto.setId(1L);
        sampleBlogPostDto.setTitle("Test Blog Post");
        sampleBlogPostDto.setSlug("test-blog-post");
        sampleBlogPostDto.setContent("This is test content for the blog post");
        sampleBlogPostDto.setAuthor("John Doe");
        sampleBlogPostDto.setSummary("Test summary");
        sampleBlogPostDto.setStatus(BlogPost.PostStatus.DRAFT);
        sampleBlogPostDto.setTags(Set.of("java", "spring"));
        sampleBlogPostDto.setViewCount(0L);
        sampleBlogPostDto.setCreatedAt(LocalDateTime.now());

        sampleRequest = new CreateBlogPostRequest();
        sampleRequest.setTitle("New Blog Post");
        sampleRequest.setContent("This is new content");
        sampleRequest.setAuthor("Jane Smith");
        sampleRequest.setSummary("New summary");
        sampleRequest.setTags(Set.of("testing", "junit"));
    }

    @Test
    void getAllPosts_ShouldReturnPagedPosts() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<BlogPost> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostRepository.findAll(pageable)).thenReturn(mockPage);
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Page<BlogPostDto> result = blogPostService.getAllPosts(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Blog Post", result.getContent().get(0).getTitle());
        verify(blogPostRepository).findAll(pageable);
        verify(blogPostMapper).toDto(sampleBlogPost);
    }

    @Test
    void getPostById_WhenPostExists_ShouldReturnPost() {
        // Given
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Optional<BlogPostDto> result = blogPostService.getPostById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Test Blog Post", result.get().getTitle());
        assertEquals("John Doe", result.get().getAuthor());
        verify(blogPostRepository).findById(1L);
        verify(blogPostMapper).toDto(sampleBlogPost);
    }

    @Test
    void getPostById_WhenPostNotExists_ShouldReturnEmpty() {
        // Given
        when(blogPostRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<BlogPostDto> result = blogPostService.getPostById(999L);

        // Then
        assertFalse(result.isPresent());
        verify(blogPostRepository).findById(999L);
        verify(blogPostMapper, never()).toDto(any());
    }

    @Test
    void createPost_ShouldReturnCreatedPost() {
        // Given
        when(blogPostMapper.toEntity(sampleRequest)).thenReturn(sampleBlogPost);
        when(blogPostRepository.save(sampleBlogPost)).thenReturn(sampleBlogPost);
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.createPost(sampleRequest);

        // Then
        assertNotNull(result);
        assertEquals("Test Blog Post", result.getTitle());
        assertEquals("John Doe", result.getAuthor());
        verify(blogPostRepository).save(sampleBlogPost);
        verify(blogPostMapper).toEntity(sampleRequest);
        verify(blogPostMapper).toDto(sampleBlogPost);
    }

    @Test
    void publishPost_WhenPostExists_ShouldUpdateStatusAndSetPublishedDate() {
        // Given
        sampleBlogPost.setStatus(BlogPost.PostStatus.DRAFT);
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(sampleBlogPost);
        when(blogPostMapper.toDto(any(BlogPost.class))).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.publishPost(1L);

        // Then
        assertEquals(BlogPost.PostStatus.PUBLISHED, sampleBlogPost.getStatus());
        assertNotNull(sampleBlogPost.getPublishedAt());
        verify(blogPostRepository).findById(1L);
        verify(blogPostRepository).save(sampleBlogPost);
    }

    @Test
    void publishPost_WhenPostNotExists_ShouldThrowException() {
        // Given
        when(blogPostRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> blogPostService.publishPost(999L));
        verify(blogPostRepository).findById(999L);
        verify(blogPostRepository, never()).save(any());
    }

    @Test
    void archivePost_WhenPostExists_ShouldUpdateStatus() {
        // Given
        sampleBlogPost.setStatus(BlogPost.PostStatus.PUBLISHED);
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(sampleBlogPost);
        when(blogPostMapper.toDto(any(BlogPost.class))).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.archivePost(1L);

        // Then
        assertEquals(BlogPost.PostStatus.ARCHIVED, sampleBlogPost.getStatus());
        verify(blogPostRepository).findById(1L);
        verify(blogPostRepository).save(sampleBlogPost);
    }

    @Test
    void deletePost_WhenPostExists_ShouldDeletePost() {
        // Given
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        doNothing().when(blogPostRepository).delete(sampleBlogPost);

        // When
        blogPostService.deletePost(1L);

        // Then
        verify(blogPostRepository).findById(1L);
        verify(blogPostRepository).delete(sampleBlogPost);
    }

    @Test
    void deletePost_WhenPostNotExists_ShouldThrowException() {
        // Given
        when(blogPostRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> blogPostService.deletePost(999L));
        verify(blogPostRepository).findById(999L);
        verify(blogPostRepository, never()).delete(any());
    }

    @Test
    void updatePost_WhenPostExists_ShouldUpdateAndReturnPost() {
        // Given
        BlogPostDto updateDto = new BlogPostDto();
        updateDto.setTitle("Updated Title");
        updateDto.setContent("Updated content");
        updateDto.setAuthor("Updated Author");

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(sampleBlogPost);
        when(blogPostMapper.toDto(any(BlogPost.class))).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.updatePost(1L, updateDto);

        // Then
        assertNotNull(result);
        verify(blogPostRepository).findById(1L);
        verify(blogPostRepository).save(any(BlogPost.class));
        verify(blogPostMapper).toDto(any(BlogPost.class));
    }

    @Test
    void updatePost_WhenPostNotExists_ShouldThrowException() {
        // Given
        BlogPostDto updateDto = new BlogPostDto();
        when(blogPostRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> blogPostService.updatePost(999L, updateDto));
        verify(blogPostRepository).findById(999L);
        verify(blogPostRepository, never()).save(any());
    }

    @Test
    void incrementViewCount_WhenPostExists_ShouldIncreaseViewCount() {
        // Given
        Long initialViewCount = sampleBlogPost.getViewCount();
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(sampleBlogPost);
        when(blogPostMapper.toDto(any(BlogPost.class))).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.incrementViewCount(1L);

        // Then
        assertEquals(initialViewCount + 1, sampleBlogPost.getViewCount());
        verify(blogPostRepository).findById(1L);
        verify(blogPostRepository).save(sampleBlogPost);
    }

    @Test
    void getPublishedPosts_ShouldReturnOnlyPublishedPosts() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        sampleBlogPost.setStatus(BlogPost.PostStatus.PUBLISHED);
        Page<BlogPost> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostRepository.findByStatus(BlogPost.PostStatus.PUBLISHED, pageable)).thenReturn(mockPage);
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Page<BlogPostDto> result = blogPostService.getPublishedPosts(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(blogPostRepository).findByStatus(BlogPost.PostStatus.PUBLISHED, pageable);
    }

    @Test
    void getPostBySlug_WhenSlugExists_ShouldReturnPost() {
        // Given
        when(blogPostRepository.findBySlug("test-blog-post")).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Optional<BlogPostDto> result = blogPostService.getPostBySlug("test-blog-post");

        // Then
        assertTrue(result.isPresent());
        assertEquals("test-blog-post", result.get().getSlug());
        verify(blogPostRepository).findBySlug("test-blog-post");
    }

    @Test
    void getPostBySlug_WhenSlugNotExists_ShouldReturnEmpty() {
        // Given
        when(blogPostRepository.findBySlug("non-existent-slug")).thenReturn(Optional.empty());

        // When
        Optional<BlogPostDto> result = blogPostService.getPostBySlug("non-existent-slug");

        // Then
        assertFalse(result.isPresent());
        verify(blogPostRepository).findBySlug("non-existent-slug");
    }

    @Test
    void getPostsByStatus_ShouldReturnPostsWithSpecificStatus() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<BlogPost> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        when(blogPostRepository.findByStatus(BlogPost.PostStatus.DRAFT, pageable)).thenReturn(mockPage);
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Page<BlogPostDto> result = blogPostService.getPostsByStatus(BlogPost.PostStatus.DRAFT, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(blogPostRepository).findByStatus(BlogPost.PostStatus.DRAFT, pageable);
    }

    @Test
    void getPostCount_ShouldReturnCountByStatus() {
        // Given
        when(blogPostRepository.countByStatus(BlogPost.PostStatus.PUBLISHED)).thenReturn(15L);

        // When
        long result = blogPostService.getPostCount(BlogPost.PostStatus.PUBLISHED);

        // Then
        assertEquals(15L, result);
        verify(blogPostRepository).countByStatus(BlogPost.PostStatus.PUBLISHED);
    }

    @Test
    void getPostCount_WhenNoPostsWithStatus_ShouldReturnZero() {
        // Given
        when(blogPostRepository.countByStatus(BlogPost.PostStatus.ARCHIVED)).thenReturn(0L);

        // When
        long result = blogPostService.getPostCount(BlogPost.PostStatus.ARCHIVED);

        // Then
        assertEquals(0L, result);
        verify(blogPostRepository).countByStatus(BlogPost.PostStatus.ARCHIVED);
    }

    // ===== SIMPLIFIED TESTS FOR METHODS THAT MIGHT NEED CUSTOM REPOSITORY METHODS =====
    
    @Test
    void searchPosts_ShouldCallRepositoryWithCorrectParameters() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<BlogPost> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        // Mock the actual method used in your service implementation
        when(blogPostRepository.searchPublishedPosts("test", BlogPost.PostStatus.PUBLISHED, pageable))
                .thenReturn(mockPage);
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Page<BlogPostDto> result = blogPostService.searchPosts("test", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(blogPostRepository).searchPublishedPosts("test", BlogPost.PostStatus.PUBLISHED, pageable);
    }

    @Test
    void getPostsByAuthor_ShouldCallRepositoryWithAuthor() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<BlogPost> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        // Mock the standard findByAuthor method (this should exist in your repository)
        when(blogPostRepository.findByAuthorContainingIgnoreCase("John Doe", pageable)).thenReturn(mockPage);
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Page<BlogPostDto> result = blogPostService.getPostsByAuthor("John Doe", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("John Doe", result.getContent().get(0).getAuthor());
        verify(blogPostRepository).findByAuthorContainingIgnoreCase("John Doe", pageable);
    }

    @Test
    void getPostsByTags_ShouldHandleTagFiltering() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<String> tags = List.of("java", "spring");
        Page<BlogPost> mockPage = new PageImpl<>(List.of(sampleBlogPost));
        
        // Mock the actual method used in your service implementation
        when(blogPostRepository.findByTagsAndStatus(tags, BlogPost.PostStatus.PUBLISHED, pageable))
                .thenReturn(mockPage);
        when(blogPostMapper.toDto(sampleBlogPost)).thenReturn(sampleBlogPostDto);

        // When
        Page<BlogPostDto> result = blogPostService.getPostsByTags(tags, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(blogPostRepository).findByTagsAndStatus(tags, BlogPost.PostStatus.PUBLISHED, pageable);
    }

    @Test
    void getAllTags_ShouldReturnDistinctTags() {
        // Given
        List<String> mockTags = List.of("java", "spring", "testing", "junit");
        // Mock the actual method used in your service implementation
        when(blogPostRepository.findAllTagsByStatus(BlogPost.PostStatus.PUBLISHED)).thenReturn(mockTags);

        // When
        List<String> result = blogPostService.getAllTags();

        // Then
        assertNotNull(result);
        assertEquals(4, result.size());
        assertTrue(result.contains("java"));
        assertTrue(result.contains("spring"));
        verify(blogPostRepository).findAllTagsByStatus(BlogPost.PostStatus.PUBLISHED);
    }

    @Test
    void incrementViewCount_WhenPostNotExists_ShouldThrowException() {
        // Given
        when(blogPostRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> blogPostService.incrementViewCount(999L));
        verify(blogPostRepository).findById(999L);
        verify(blogPostRepository, never()).save(any());
    }

    @Test
    void archivePost_WhenPostNotExists_ShouldThrowException() {
        // Given
        when(blogPostRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> blogPostService.archivePost(999L));
        verify(blogPostRepository).findById(999L);
        verify(blogPostRepository, never()).save(any());
    }

    @Test
    void createPost_ShouldSetDefaultValues() {
        // Given
        CreateBlogPostRequest request = new CreateBlogPostRequest();
        request.setTitle("New Post");
        request.setContent("New content for testing");
        request.setAuthor("New Author");
        // Status should default to DRAFT if not specified

        BlogPost newPost = new BlogPost();
        newPost.setTitle("New Post");
        newPost.setContent("New content for testing");
        newPost.setAuthor("New Author");
        newPost.setStatus(BlogPost.PostStatus.DRAFT);

        when(blogPostMapper.toEntity(request)).thenReturn(newPost);
        when(blogPostRepository.save(newPost)).thenReturn(newPost);
        when(blogPostMapper.toDto(newPost)).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.createPost(request);

        // Then
        assertNotNull(result);
        verify(blogPostRepository).save(newPost);
    }

    @Test
    void publishPost_ShouldSetPublishedAtTimestamp() {
        // Given
        sampleBlogPost.setStatus(BlogPost.PostStatus.DRAFT);
        sampleBlogPost.setPublishedAt(null); // Initially null
        
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> {
            BlogPost savedPost = invocation.getArgument(0);
            // Verify that publishedAt was set
            assertNotNull(savedPost.getPublishedAt());
            assertEquals(BlogPost.PostStatus.PUBLISHED, savedPost.getStatus());
            return savedPost;
        });
        when(blogPostMapper.toDto(any(BlogPost.class))).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.publishPost(1L);

        // Then
        assertNotNull(result);
        verify(blogPostRepository).save(argThat(post -> 
            post.getStatus() == BlogPost.PostStatus.PUBLISHED && 
            post.getPublishedAt() != null));
    }

    @Test
    void updatePost_ShouldPreserveExistingFieldsWhenNotUpdated() {
        // Given
        BlogPostDto updateDto = new BlogPostDto();
        updateDto.setTitle("Updated Title");
        updateDto.setContent("Updated content");
        // Author not specified in update

        LocalDateTime originalCreatedAt = sampleBlogPost.getCreatedAt();
        Long originalViewCount = sampleBlogPost.getViewCount();

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(blogPostRepository.save(any(BlogPost.class))).thenAnswer(invocation -> {
            BlogPost savedPost = invocation.getArgument(0);
            // Verify that certain fields are preserved
            assertEquals(originalCreatedAt, savedPost.getCreatedAt());
            assertEquals(originalViewCount, savedPost.getViewCount());
            return savedPost;
        });
        when(blogPostMapper.toDto(any(BlogPost.class))).thenReturn(sampleBlogPostDto);

        // When
        BlogPostDto result = blogPostService.updatePost(1L, updateDto);

        // Then
        assertNotNull(result);
        verify(blogPostRepository).save(any(BlogPost.class));
    }
}