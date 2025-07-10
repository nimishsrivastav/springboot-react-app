package com.blogpostapp.backend.service.impl;

import com.blogpostapp.backend.dto.CommentDto;
import com.blogpostapp.backend.entity.BlogPost;
import com.blogpostapp.backend.entity.Comment;
import com.blogpostapp.backend.exception.ResourceNotFoundException;
import com.blogpostapp.backend.mapper.CommentMapper;
import com.blogpostapp.backend.repository.BlogPostRepository;
import com.blogpostapp.backend.repository.CommentRepository;
import com.blogpostapp.backend.service.interfaces.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {
    
    private final CommentRepository commentRepository;
    private final BlogPostRepository blogPostRepository;
    private final CommentMapper commentMapper;
    
    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository, 
                             BlogPostRepository blogPostRepository,
                             CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.blogPostRepository = blogPostRepository;
        this.commentMapper = commentMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<CommentDto> getCommentsByPostId(Long postId, Pageable pageable) {
        return commentRepository.findByBlogPostIdOrderByCreatedAtDesc(postId, pageable)
                .map(commentMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<CommentDto> getCommentById(Long id) {
        return commentRepository.findById(id)
                .map(commentMapper::toDto);
    }
    
    @Override
    public CommentDto createComment(Long postId, CommentDto commentDto) {
        BlogPost blogPost = blogPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + postId));
        
        Comment comment = commentMapper.toEntity(commentDto);
        comment.setBlogPost(blogPost);
        
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }
    
    @Override
    public CommentDto updateComment(Long id, CommentDto commentDto) {
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        
        existingComment.setContent(commentDto.getContent());
        existingComment.setAuthorName(commentDto.getAuthorName());
        existingComment.setAuthorEmail(commentDto.getAuthorEmail());
        
        Comment updatedComment = commentRepository.save(existingComment);
        return commentMapper.toDto(updatedComment);
    }
    
    @Override
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        commentRepository.delete(comment);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getCommentCountByPostId(Long postId) {
        return commentRepository.countByBlogPostId(postId);
    }
}
