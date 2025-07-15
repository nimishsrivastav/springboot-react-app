package com.blogpostapp.backend;

import com.blogpostapp.backend.controller.CommentController;
import com.blogpostapp.backend.dto.CommentDto;
import com.blogpostapp.backend.service.interfaces.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    private CommentDto sampleComment;

    @BeforeEach
    void setUp() {
        sampleComment = new CommentDto();
        sampleComment.setId(1L);
        sampleComment.setContent("This is a test comment");
        sampleComment.setAuthorName("John Commenter");
        sampleComment.setAuthorEmail("john@example.com");
        sampleComment.setBlogPostId(1L);
        sampleComment.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getCommentsByPostId_ValidPostId_ShouldReturnPagedComments() throws Exception {
        // Given
        Page<CommentDto> mockPage = new PageImpl<>(List.of(sampleComment));
        when(commentService.getCommentsByPostId(eq(1L), any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/comments/post/1")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].content").value("This is a test comment"))
                .andExpect(jsonPath("$.content[0].authorName").value("John Commenter"))
                .andExpect(jsonPath("$.content[0].blogPostId").value(1))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(commentService).getCommentsByPostId(eq(1L), any(Pageable.class));
    }

    @Test
    void getCommentsByPostId_EmptyResult_ShouldReturnEmptyPage() throws Exception {
        // Given
        Page<CommentDto> emptyPage = new PageImpl<>(List.of());
        when(commentService.getCommentsByPostId(eq(999L), any(Pageable.class))).thenReturn(emptyPage);

        // When & Then
        mockMvc.perform(get("/api/v1/comments/post/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty())
                .andExpect(jsonPath("$.totalElements").value(0));

        verify(commentService).getCommentsByPostId(eq(999L), any(Pageable.class));
    }

    @Test
    void getCommentById_ValidId_ShouldReturnComment() throws Exception {
        // Given
        when(commentService.getCommentById(1L)).thenReturn(Optional.of(sampleComment));

        // When & Then
        mockMvc.perform(get("/api/v1/comments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.content").value("This is a test comment"))
                .andExpect(jsonPath("$.authorName").value("John Commenter"));

        verify(commentService).getCommentById(1L);
    }

    @Test
    void getCommentById_InvalidId_ShouldReturn404() throws Exception {
        // Given
        when(commentService.getCommentById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/v1/comments/999"))
                .andExpect(status().isNotFound());

        verify(commentService).getCommentById(999L);
    }

    @Test
    void createComment_ValidRequest_ShouldReturnCreatedComment() throws Exception {
        // Given
        CommentDto newComment = new CommentDto();
        newComment.setContent("New comment content");
        newComment.setAuthorName("Jane Doe");
        newComment.setAuthorEmail("jane@example.com");

        when(commentService.createComment(eq(1L), any(CommentDto.class))).thenReturn(sampleComment);

        // When & Then
        mockMvc.perform(post("/api/v1/comments/post/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newComment)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("This is a test comment"))
                .andExpect(jsonPath("$.authorName").value("John Commenter"))
                .andExpect(jsonPath("$.blogPostId").value(1));

        verify(commentService).createComment(eq(1L), any(CommentDto.class));
    }

    @Test
    void createComment_MissingContent_ShouldReturnBadRequest() throws Exception {
        // Given
        CommentDto invalidComment = new CommentDto();
        invalidComment.setAuthorName("Jane Doe");
        invalidComment.setAuthorEmail("jane@example.com");
        // Content is missing

        // When & Then
        mockMvc.perform(post("/api/v1/comments/post/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidComment)))
                .andExpect(status().isBadRequest());

        verify(commentService, never()).createComment(anyLong(), any(CommentDto.class));
    }

    @Test
    void createComment_ContentTooLong_ShouldReturnBadRequest() throws Exception {
        // Given
        CommentDto invalidComment = new CommentDto();
        invalidComment.setContent("a".repeat(501)); // Exceeds 500 character limit
        invalidComment.setAuthorName("Jane Doe");
        invalidComment.setAuthorEmail("jane@example.com");

        // When & Then
        mockMvc.perform(post("/api/v1/comments/post/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidComment)))
                .andExpect(status().isBadRequest());

        verify(commentService, never()).createComment(anyLong(), any(CommentDto.class));
    }

    @Test
    void createComment_AuthorNameTooShort_ShouldReturnBadRequest() throws Exception {
        // Given
        CommentDto invalidComment = new CommentDto();
        invalidComment.setContent("Valid comment content");
        invalidComment.setAuthorName("A"); // Too short (< 2 characters)
        invalidComment.setAuthorEmail("jane@example.com");

        // When & Then
        mockMvc.perform(post("/api/v1/comments/post/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidComment)))
                .andExpect(status().isBadRequest());

        verify(commentService, never()).createComment(anyLong(), any(CommentDto.class));
    }

    @Test
    void createComment_EmailTooLong_ShouldReturnBadRequest() throws Exception {
        // Given
        CommentDto invalidComment = new CommentDto();
        invalidComment.setContent("Valid comment content");
        invalidComment.setAuthorName("Jane Doe");
        invalidComment.setAuthorEmail("a".repeat(101) + "@example.com"); // Exceeds 100 characters

        // When & Then
        mockMvc.perform(post("/api/v1/comments/post/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidComment)))
                .andExpect(status().isBadRequest());

        verify(commentService, never()).createComment(anyLong(), any(CommentDto.class));
    }

    @Test
    void updateComment_ValidRequest_ShouldReturnUpdatedComment() throws Exception {
        // Given
        CommentDto updatedComment = new CommentDto();
        updatedComment.setContent("Updated comment content");
        updatedComment.setAuthorName("John Updated");
        updatedComment.setAuthorEmail("john.updated@example.com");

        when(commentService.updateComment(eq(1L), any(CommentDto.class))).thenReturn(sampleComment);

        // When & Then
        mockMvc.perform(put("/api/v1/comments/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedComment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("This is a test comment"))
                .andExpect(jsonPath("$.authorName").value("John Commenter"));

        verify(commentService).updateComment(eq(1L), any(CommentDto.class));
    }

    @Test
    void updateComment_InvalidValidation_ShouldReturnBadRequest() throws Exception {
        // Given
        CommentDto invalidComment = new CommentDto();
        invalidComment.setContent(""); // Empty content
        invalidComment.setAuthorName("Jane Doe");

        // When & Then
        mockMvc.perform(put("/api/v1/comments/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidComment)))
                .andExpect(status().isBadRequest());

        verify(commentService, never()).updateComment(anyLong(), any(CommentDto.class));
    }

    @Test
    void deleteComment_ValidId_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(commentService).deleteComment(1L);

        // When & Then
        mockMvc.perform(delete("/api/v1/comments/1"))
                .andExpect(status().isNoContent());

        verify(commentService).deleteComment(1L);
    }

    @Test
    void getCommentCount_ValidPostId_ShouldReturnCount() throws Exception {
        // Given
        when(commentService.getCommentCountByPostId(1L)).thenReturn(15L);

        // When & Then
        mockMvc.perform(get("/api/v1/comments/post/1/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(15));

        verify(commentService).getCommentCountByPostId(1L);
    }

    @Test
    void getCommentCount_NonExistentPostId_ShouldReturnZero() throws Exception {
        // Given
        when(commentService.getCommentCountByPostId(999L)).thenReturn(0L);

        // When & Then
        mockMvc.perform(get("/api/v1/comments/post/999/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(0));

        verify(commentService).getCommentCountByPostId(999L);
    }

    @Test
    void getCommentsByPostId_WithCustomPagination_ShouldRespectParameters() throws Exception {
        // Given
        CommentDto comment1 = new CommentDto();
        comment1.setId(1L);
        comment1.setContent("First comment");
        comment1.setAuthorName("User 1");

        CommentDto comment2 = new CommentDto();
        comment2.setId(2L);
        comment2.setContent("Second comment");
        comment2.setAuthorName("User 2");

        Page<CommentDto> mockPage = new PageImpl<>(List.of(comment1, comment2));
        when(commentService.getCommentsByPostId(eq(1L), any(Pageable.class))).thenReturn(mockPage);

        // When & Then
        mockMvc.perform(get("/api/v1/comments/post/1")
                .param("page", "1")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].content").value("First comment"))
                .andExpect(jsonPath("$.content[1].content").value("Second comment"));

        verify(commentService).getCommentsByPostId(eq(1L), any(Pageable.class));
    }

    @Test
    void createComment_WithOptionalEmail_ShouldSucceed() throws Exception {
        // Given
        CommentDto commentWithoutEmail = new CommentDto();
        commentWithoutEmail.setContent("Comment without email");
        commentWithoutEmail.setAuthorName("Anonymous User");
        // No email provided

        when(commentService.createComment(eq(1L), any(CommentDto.class))).thenReturn(sampleComment);

        // When & Then
        mockMvc.perform(post("/api/v1/comments/post/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentWithoutEmail)))
                .andExpect(status().isCreated());

        verify(commentService).createComment(eq(1L), any(CommentDto.class));
    }
}