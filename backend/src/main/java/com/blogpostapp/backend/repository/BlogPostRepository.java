package com.blogpostapp.backend.repository;

import com.blogpostapp.backend.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    // Basic queries
    Page<BlogPost> findByStatus(BlogPost.PostStatus status, Pageable pageable);
    Page<BlogPost> findByAuthorContainingIgnoreCase(String author, Pageable pageable);
    Page<BlogPost> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Optional<BlogPost> findBySlug(String slug);
    
    // Complex queries with JPQL
    @Query("SELECT p FROM BlogPost p WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<BlogPost> findPublishedPostsOrderByDate(@Param("status") BlogPost.PostStatus status);
    
    @Query("SELECT p FROM BlogPost p WHERE " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "p.status = :status")
    Page<BlogPost> searchPublishedPosts(@Param("keyword") String keyword, 
                                       @Param("status") BlogPost.PostStatus status, 
                                       Pageable pageable);
    
    @Query("SELECT p FROM BlogPost p JOIN p.tags t WHERE t IN :tags AND p.status = :status")
    Page<BlogPost> findByTagsAndStatus(@Param("tags") List<String> tags, 
                                      @Param("status") BlogPost.PostStatus status, 
                                      Pageable pageable);
    
    @Query("SELECT DISTINCT t FROM BlogPost p JOIN p.tags t WHERE p.status = :status")
    List<String> findAllTagsByStatus(@Param("status") BlogPost.PostStatus status);
    
    @Query("SELECT COUNT(p) FROM BlogPost p WHERE p.status = :status")
    long countByStatus(@Param("status") BlogPost.PostStatus status);
    
    @Query("SELECT p.author, COUNT(p) FROM BlogPost p WHERE p.status = :status GROUP BY p.author")
    List<Object[]> countPostsByAuthor(@Param("status") BlogPost.PostStatus status);
}