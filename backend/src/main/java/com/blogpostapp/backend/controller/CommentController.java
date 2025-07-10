package com.blogpostapp.backend.controller;

import com.blogpostapp.backend.dto.CommentDto;
import com.blogpostapp.backend.service.interfaces.CommentService;
import io.swagger.v3.oas.annotations.Operation;
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

@RestController
@RequestMapping("/api/v1/comments")
@Tag(name = "Comments", description = "Comment management API")
public class CommentController {
    
    private final CommentService commentService;
    
    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    
    @GetMapping("/post/{postId}")
    @Operation(summary = "Get comments by post ID", description = "Retrieve all comments for a specific blog post")
    public ResponseEntity<Page<CommentDto>> getCommentsByPostId(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CommentDto> comments = commentService.getCommentsByPostId(postId, pageable);
        return ResponseEntity.ok(comments);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get comment by ID", description = "Retrieve a specific comment by its ID")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long id) {
        return commentService.getCommentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/post/{postId}")
    @Operation(summary = "Create comment", description = "Create a new comment for a blog post")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentDto commentDto) {
        CommentDto createdComment = commentService.createComment(postId, commentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update comment", description = "Update an existing comment")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentDto commentDto) {
        CommentDto updatedComment = commentService.updateComment(id, commentDto);
        return ResponseEntity.ok(updatedComment);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete comment", description = "Delete a comment permanently")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/post/{postId}/count")
    @Operation(summary = "Get comment count", description = "Get the number of comments for a blog post")
    public ResponseEntity<Long> getCommentCount(@PathVariable Long postId) {
        long count = commentService.getCommentCountByPostId(postId);
        return ResponseEntity.ok(count);
    }
}
