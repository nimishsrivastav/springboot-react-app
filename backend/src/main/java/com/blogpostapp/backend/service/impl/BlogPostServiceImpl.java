package com.blogpostapp.backend.service.impl;

import com.blogpostapp.backend.dto.BlogPostDto;
import com.blogpostapp.backend.dto.CreateBlogPostRequest;
import com.blogpostapp.backend.entity.BlogPost;
import com.blogpostapp.backend.exception.ResourceNotFoundException;
import com.blogpostapp.backend.mapper.BlogPostMapper;
import com.blogpostapp.backend.repository.BlogPostRepository;
import com.blogpostapp.backend.service.interfaces.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BlogPostServiceImpl implements BlogPostService {
    
    private final BlogPostRepository blogPostRepository;
    private final BlogPostMapper blogPostMapper;
    
    @Autowired
    public BlogPostServiceImpl(BlogPostRepository blogPostRepository, BlogPostMapper blogPostMapper) {
        this.blogPostRepository = blogPostRepository;
        this.blogPostMapper = blogPostMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BlogPostDto> getAllPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "publishedPosts", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<BlogPostDto> getPublishedPosts(Pageable pageable) {
        return blogPostRepository.findByStatus(BlogPost.PostStatus.PUBLISHED, pageable)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<BlogPostDto> getPostById(Long id) {
        return blogPostRepository.findById(id)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "postBySlug", key = "#slug")
    public Optional<BlogPostDto> getPostBySlug(String slug) {
        return blogPostRepository.findBySlug(slug)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BlogPostDto> getPostsByAuthor(String author, Pageable pageable) {
        return blogPostRepository.findByAuthorContainingIgnoreCase(author, pageable)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BlogPostDto> searchPosts(String keyword, Pageable pageable) {
        return blogPostRepository.searchPublishedPosts(keyword, BlogPost.PostStatus.PUBLISHED, pageable)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BlogPostDto> getPostsByTags(List<String> tags, Pageable pageable) {
        return blogPostRepository.findByTagsAndStatus(tags, BlogPost.PostStatus.PUBLISHED, pageable)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BlogPostDto> getPostsByStatus(BlogPost.PostStatus status, Pageable pageable) {
        return blogPostRepository.findByStatus(status, pageable)
                .map(blogPostMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "allTags")
    public List<String> getAllTags() {
        return blogPostRepository.findAllTagsByStatus(BlogPost.PostStatus.PUBLISHED);
    }
    
    @Override
    @CacheEvict(value = {"publishedPosts", "allTags"}, allEntries = true)
    public BlogPostDto createPost(CreateBlogPostRequest request) {
        BlogPost blogPost = blogPostMapper.toEntity(request);
        BlogPost savedPost = blogPostRepository.save(blogPost);
        return blogPostMapper.toDto(savedPost);
    }
    
    @Override
    @CacheEvict(value = {"publishedPosts", "postBySlug", "allTags"}, allEntries = true)
    public BlogPostDto updatePost(Long id, BlogPostDto postDto) {
        BlogPost existingPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        
        blogPostMapper.updateEntity(existingPost, postDto);
        BlogPost updatedPost = blogPostRepository.save(existingPost);
        return blogPostMapper.toDto(updatedPost);
    }
    
    @Override
    @CacheEvict(value = {"publishedPosts", "postBySlug"}, allEntries = true)
    public BlogPostDto publishPost(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        
        post.setStatus(BlogPost.PostStatus.PUBLISHED);
        BlogPost publishedPost = blogPostRepository.save(post);
        return blogPostMapper.toDto(publishedPost);
    }
    
    @Override
    @CacheEvict(value = {"publishedPosts", "postBySlug"}, allEntries = true)
    public BlogPostDto archivePost(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        
        post.setStatus(BlogPost.PostStatus.ARCHIVED);
        BlogPost archivedPost = blogPostRepository.save(post);
        return blogPostMapper.toDto(archivedPost);
    }
    
    @Override
    @CacheEvict(value = {"publishedPosts", "postBySlug", "allTags"}, allEntries = true)
    public void deletePost(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        blogPostRepository.delete(post);
    }
    
    @Override
    public BlogPostDto incrementViewCount(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        
        post.incrementViewCount();
        BlogPost updatedPost = blogPostRepository.save(post);
        return blogPostMapper.toDto(updatedPost);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getPostCount(BlogPost.PostStatus status) {
        return blogPostRepository.countByStatus(status);
    }
}
