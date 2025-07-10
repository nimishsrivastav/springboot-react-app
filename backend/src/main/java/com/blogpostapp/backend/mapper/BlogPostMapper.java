package com.blogpostapp.backend.mapper;

import com.blogpostapp.backend.dto.BlogPostDto;
import com.blogpostapp.backend.dto.CreateBlogPostRequest;
import com.blogpostapp.backend.entity.BlogPost;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BlogPostMapper {
    
    @Mapping(target = "commentCount", expression = "java(blogPost.getComments() != null ? blogPost.getComments().size() : 0)")
    BlogPostDto toDto(BlogPost blogPost);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "viewCount", constant = "0L")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    BlogPost toEntity(CreateBlogPostRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    void updateEntity(@MappingTarget BlogPost blogPost, BlogPostDto dto);
}