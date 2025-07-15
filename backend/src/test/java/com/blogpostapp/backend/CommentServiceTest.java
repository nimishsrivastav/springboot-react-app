package com.blogpostapp.backend;

import com.blogpostapp.backend.dto.CommentDto;
import com.blogpostapp.backend.entity.BlogPost;
import com.blogpostapp.backend.entity.Comment;
import com.blogpostapp.backend.exception.ResourceNotFoundException;
import com.blogpostapp.backend.mapper.CommentMapper;
import com.blogpostapp.backend.repository.BlogPostRepository;
import com.blogpostapp.backend.repository.CommentRepository;
import com.blogpostapp.backend.service.impl.CommentServiceImpl;

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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private BlogPostRepository blogPostRepository;

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    private Comment sampleComment;
    private CommentDto sampleCommentDto;
    private BlogPost sampleBlogPost;

    @BeforeEach
    void setUp() {
        sampleBlogPost = new BlogPost();
        sampleBlogPost.setId(1L);
        sampleBlogPost.setTitle("Test Blog Post");
        sampleBlogPost.setAuthor("John Doe");
        sampleBlogPost.setStatus(BlogPost.PostStatus.PUBLISHED);

        sampleComment = new Comment();
        sampleComment.setId(1L);
        sampleComment.setContent("This is a test comment");
        sampleComment.setAuthorName("Jane Commenter");
        sampleComment.setAuthorEmail("jane@example.com");
        sampleComment.setBlogPost(sampleBlogPost);
        sampleComment.setCreatedAt(LocalDateTime.now());

        sampleCommentDto = new CommentDto();
        sampleCommentDto.setId(1L);
        sampleCommentDto.setContent("This is a test comment");
        sampleCommentDto.setAuthorName("Jane Commenter");
        sampleCommentDto.setAuthorEmail("jane@example.com");
        sampleCommentDto.setBlogPostId(1L);
        sampleCommentDto.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getCommentsByPostId_ShouldReturnPagedComments() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Comment> mockPage = new PageImpl<>(List.of(sampleComment));
        when(commentRepository.findByBlogPostIdOrderByCreatedAtDesc(1L, pageable)).thenReturn(mockPage);
        when(commentMapper.toDto(sampleComment)).thenReturn(sampleCommentDto);

        // When
        Page<CommentDto> result = commentService.getCommentsByPostId(1L, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("This is a test comment", result.getContent().get(0).getContent());
        assertEquals("Jane Commenter", result.getContent().get(0).getAuthorName());
        verify(commentRepository).findByBlogPostIdOrderByCreatedAtDesc(1L, pageable);
        verify(commentMapper).toDto(sampleComment);
    }

    @Test
    void getCommentsByPostId_WhenNoComments_ShouldReturnEmptyPage() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Comment> emptyPage = new PageImpl<>(List.of());
        when(commentRepository.findByBlogPostIdOrderByCreatedAtDesc(999L, pageable)).thenReturn(emptyPage);

        // When
        Page<CommentDto> result = commentService.getCommentsByPostId(999L, pageable);

        // Then
        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
        verify(commentRepository).findByBlogPostIdOrderByCreatedAtDesc(999L, pageable);
        verify(commentMapper, never()).toDto(any());
    }

    @Test
    void getCommentById_WhenCommentExists_ShouldReturnComment() {
        // Given
        when(commentRepository.findById(1L)).thenReturn(Optional.of(sampleComment));
        when(commentMapper.toDto(sampleComment)).thenReturn(sampleCommentDto);

        // When
        Optional<CommentDto> result = commentService.getCommentById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("This is a test comment", result.get().getContent());
        assertEquals("Jane Commenter", result.get().getAuthorName());
        assertEquals(1L, result.get().getBlogPostId());
        verify(commentRepository).findById(1L);
        verify(commentMapper).toDto(sampleComment);
    }

    @Test
    void getCommentById_WhenCommentNotExists_ShouldReturnEmpty() {
        // Given
        when(commentRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<CommentDto> result = commentService.getCommentById(999L);

        // Then
        assertFalse(result.isPresent());
        verify(commentRepository).findById(999L);
        verify(commentMapper, never()).toDto(any());
    }

    @Test
    void createComment_WhenBlogPostExists_ShouldCreateAndReturnComment() {
        // Given
        CommentDto newCommentDto = new CommentDto();
        newCommentDto.setContent("New comment content");
        newCommentDto.setAuthorName("New Author");
        newCommentDto.setAuthorEmail("new@example.com");

        Comment newComment = new Comment();
        newComment.setContent("New comment content");
        newComment.setAuthorName("New Author");
        newComment.setAuthorEmail("new@example.com");

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(commentMapper.toEntity(newCommentDto)).thenReturn(newComment);
        when(commentRepository.save(any(Comment.class))).thenReturn(sampleComment);
        when(commentMapper.toDto(sampleComment)).thenReturn(sampleCommentDto);

        // When
        CommentDto result = commentService.createComment(1L, newCommentDto);

        // Then
        assertNotNull(result);
        assertEquals("This is a test comment", result.getContent());
        verify(blogPostRepository).findById(1L);
        verify(commentMapper).toEntity(newCommentDto);
        verify(commentRepository).save(any(Comment.class));
        verify(commentMapper).toDto(sampleComment);
    }

    @Test
    void createComment_WhenBlogPostNotExists_ShouldThrowException() {
        // Given
        CommentDto newCommentDto = new CommentDto();
        newCommentDto.setContent("New comment content");
        newCommentDto.setAuthorName("New Author");

        when(blogPostRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> commentService.createComment(999L, newCommentDto)
        );

        assertTrue(exception.getMessage().contains("Blog post not found with id: 999"));
        verify(blogPostRepository).findById(999L);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void updateComment_WhenCommentExists_ShouldUpdateAndReturnComment() {
        // Given
        CommentDto updateDto = new CommentDto();
        updateDto.setContent("Updated comment content");
        updateDto.setAuthorName("Updated Author");
        updateDto.setAuthorEmail("updated@example.com");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(sampleComment));
        when(commentRepository.save(any(Comment.class))).thenReturn(sampleComment);
        when(commentMapper.toDto(sampleComment)).thenReturn(sampleCommentDto);

        // When
        CommentDto result = commentService.updateComment(1L, updateDto);

        // Then
        assertNotNull(result);
        verify(commentRepository).findById(1L);
        verify(commentRepository).save(any(Comment.class));
        verify(commentMapper).toDto(sampleComment);
    }

    @Test
    void updateComment_WhenCommentNotExists_ShouldThrowException() {
        // Given
        CommentDto updateDto = new CommentDto();
        updateDto.setContent("Updated content");

        when(commentRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> commentService.updateComment(999L, updateDto)
        );

        assertTrue(exception.getMessage().contains("Comment not found with id: 999"));
        verify(commentRepository).findById(999L);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void deleteComment_WhenCommentExists_ShouldDeleteComment() {
        // Given
        when(commentRepository.findById(1L)).thenReturn(Optional.of(sampleComment));
        doNothing().when(commentRepository).delete(sampleComment);

        // When
        commentService.deleteComment(1L);

        // Then
        verify(commentRepository).findById(1L);
        verify(commentRepository).delete(sampleComment);
    }

    @Test
    void deleteComment_WhenCommentNotExists_ShouldThrowException() {
        // Given
        when(commentRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> commentService.deleteComment(999L)
        );

        assertTrue(exception.getMessage().contains("Comment not found with id: 999"));
        verify(commentRepository).findById(999L);
        verify(commentRepository, never()).delete(any());
    }

    @Test
    void getCommentCountByPostId_ShouldReturnCorrectCount() {
        // Given
        when(commentRepository.countByBlogPostId(1L)).thenReturn(15L);

        // When
        long result = commentService.getCommentCountByPostId(1L);

        // Then
        assertEquals(15L, result);
        verify(commentRepository).countByBlogPostId(1L);
    }

    @Test
    void getCommentCountByPostId_WhenNoComments_ShouldReturnZero() {
        // Given
        when(commentRepository.countByBlogPostId(999L)).thenReturn(0L);

        // When
        long result = commentService.getCommentCountByPostId(999L);

        // Then
        assertEquals(0L, result);
        verify(commentRepository).countByBlogPostId(999L);
    }

    @Test
    void createComment_ShouldSetBlogPostCorrectly() {
        // Given
        CommentDto newCommentDto = new CommentDto();
        newCommentDto.setContent("Comment with blog post association");
        newCommentDto.setAuthorName("Test Author");

        Comment newComment = new Comment();
        newComment.setContent("Comment with blog post association");
        newComment.setAuthorName("Test Author");

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(commentMapper.toEntity(newCommentDto)).thenReturn(newComment);
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment savedComment = invocation.getArgument(0);
            assertNotNull(savedComment.getBlogPost());
            assertEquals(1L, savedComment.getBlogPost().getId());
            return savedComment;
        });
        when(commentMapper.toDto(any(Comment.class))).thenReturn(sampleCommentDto);

        // When
        CommentDto result = commentService.createComment(1L, newCommentDto);

        // Then
        assertNotNull(result);
        verify(blogPostRepository).findById(1L);
        verify(commentRepository).save(argThat(comment -> 
            comment.getBlogPost() != null && comment.getBlogPost().getId().equals(1L)));
    }

    @Test
    void updateComment_ShouldPreserveExistingBlogPostAssociation() {
        // Given
        CommentDto updateDto = new CommentDto();
        updateDto.setContent("Updated content");
        updateDto.setAuthorName("Updated Author");

        BlogPost originalBlogPost = sampleComment.getBlogPost();
        
        when(commentRepository.findById(1L)).thenReturn(Optional.of(sampleComment));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment savedComment = invocation.getArgument(0);
            // Ensure blog post association is preserved
            assertEquals(originalBlogPost, savedComment.getBlogPost());
            return savedComment;
        });
        when(commentMapper.toDto(any(Comment.class))).thenReturn(sampleCommentDto);

        // When
        CommentDto result = commentService.updateComment(1L, updateDto);

        // Then
        assertNotNull(result);
        verify(commentRepository).save(argThat(comment -> 
            comment.getBlogPost().equals(originalBlogPost)));
    }

    @Test
    void getCommentsByPostId_ShouldOrderByCreatedAtDescending() {
        // Given
        Comment comment1 = new Comment();
        comment1.setId(1L);
        comment1.setContent("First comment");
        comment1.setCreatedAt(LocalDateTime.now().minusDays(1));

        Comment comment2 = new Comment();
        comment2.setId(2L);
        comment2.setContent("Second comment");
        comment2.setCreatedAt(LocalDateTime.now());

        CommentDto dto1 = new CommentDto();
        dto1.setId(1L);
        dto1.setContent("First comment");

        CommentDto dto2 = new CommentDto();
        dto2.setId(2L);
        dto2.setContent("Second comment");

        Pageable pageable = PageRequest.of(0, 10);
        Page<Comment> mockPage = new PageImpl<>(List.of(comment2, comment1)); // Second comment first (newer)
        
        when(commentRepository.findByBlogPostIdOrderByCreatedAtDesc(1L, pageable)).thenReturn(mockPage);
        when(commentMapper.toDto(comment1)).thenReturn(dto1);
        when(commentMapper.toDto(comment2)).thenReturn(dto2);

        // When
        Page<CommentDto> result = commentService.getCommentsByPostId(1L, pageable);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals(2L, result.getContent().get(0).getId()); // Newer comment first
        assertEquals(1L, result.getContent().get(1).getId()); // Older comment second
        verify(commentRepository).findByBlogPostIdOrderByCreatedAtDesc(1L, pageable);
    }

    @Test
    void createComment_WithMinimalData_ShouldSucceed() {
        // Given
        CommentDto minimalComment = new CommentDto();
        minimalComment.setContent("Minimal comment");
        minimalComment.setAuthorName("Min Author");
        // No email provided

        Comment entity = new Comment();
        entity.setContent("Minimal comment");
        entity.setAuthorName("Min Author");

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(sampleBlogPost));
        when(commentMapper.toEntity(minimalComment)).thenReturn(entity);
        when(commentRepository.save(any(Comment.class))).thenReturn(sampleComment);
        when(commentMapper.toDto(sampleComment)).thenReturn(sampleCommentDto);

        // When
        CommentDto result = commentService.createComment(1L, minimalComment);

        // Then
        assertNotNull(result);
        verify(blogPostRepository).findById(1L);
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void getCommentCountByPostId_WithMultiplePosts_ShouldReturnCorrectCounts() {
        // Given
        when(commentRepository.countByBlogPostId(1L)).thenReturn(5L);
        when(commentRepository.countByBlogPostId(2L)).thenReturn(10L);
        when(commentRepository.countByBlogPostId(3L)).thenReturn(0L);

        // When
        long count1 = commentService.getCommentCountByPostId(1L);
        long count2 = commentService.getCommentCountByPostId(2L);
        long count3 = commentService.getCommentCountByPostId(3L);

        // Then
        assertEquals(5L, count1);
        assertEquals(10L, count2);
        assertEquals(0L, count3);
        verify(commentRepository).countByBlogPostId(1L);
        verify(commentRepository).countByBlogPostId(2L);
        verify(commentRepository).countByBlogPostId(3L);
    }
}