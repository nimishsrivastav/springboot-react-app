package com.blogpostapp.backend.mapper;

import com.blogpostapp.backend.dto.CommentDto;
import com.blogpostapp.backend.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    
    @Mapping(target = "blogPostId", source = "blogPost.id")
    CommentDto toDto(Comment comment);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "blogPost", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Comment toEntity(CommentDto dto);
}