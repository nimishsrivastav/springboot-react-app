package com.blogpostapp.backend.service.interfaces;

import com.blogpostapp.backend.dto.CommentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface CommentService {
    Page<CommentDto> getCommentsByPostId(Long postId, Pageable pageable);
    Optional<CommentDto> getCommentById(Long id);
    CommentDto createComment(Long postId, CommentDto commentDto);
    CommentDto updateComment(Long id, CommentDto commentDto);
    void deleteComment(Long id);
    long getCommentCountByPostId(Long postId);
}
