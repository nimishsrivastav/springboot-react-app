package com.blogpostapp.backend.repository;

import com.blogpostapp.backend.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    Page<Comment> findByBlogPostId(Long blogPostId, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.blogPost.id = :blogPostId")
    long countByBlogPostId(@Param("blogPostId") Long blogPostId);
    
    @Query("SELECT c FROM Comment c WHERE c.blogPost.id = :blogPostId ORDER BY c.createdAt DESC")
    Page<Comment> findByBlogPostIdOrderByCreatedAtDesc(@Param("blogPostId") Long blogPostId, Pageable pageable);
}
