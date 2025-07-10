// package com.blogpostapp.backend;

// import com.blogpostapp.backend.dto.BlogPostDto;
// import com.blogpostapp.backend.dto.CreateBlogPostRequest;
// import com.blogpostapp.backend.entity.BlogPost;
// import com.blogpostapp.backend.exception.ResourceNotFoundException;
// import com.blogpostapp.backend.mapper.BlogPostMapper;
// import com.blogpostapp.backend.repository.BlogPostRepository;
// import com.blogpostapp.backend.service.impl.BlogPostServiceImpl;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;

// import java.util.List;
// import java.util.Optional;
// import java.util.Set;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class BlogPostServiceTest {

//     @Mock
//     private BlogPostRepository blogPostRepository;

//     @Mock
//     private BlogPostMapper blogPostMapper;

//     @InjectMocks
//     private BlogPostServiceImpl blogPostService;

//     private BlogPost testPost;
//     private BlogPostDto testPostDto;
//     private CreateBlogPostRequest testRequest;

//     @BeforeEach
//     void setUp() {
//         testPost = new BlogPost();
//         testPost.setId(1L);
//         testPost.setTitle("Test Post");
//         testPost.setContent("Test content");
//         testPost.setAuthor("Test Author");
//         testPost.setStatus(BlogPost.PostStatus.PUBLISHED);
//         testPost.setTags(Set.of("test", "example"));

//         testPostDto = new BlogPostDto();
//         testPostDto.setId(1L);
//         testPostDto.setTitle("Test Post");
//         testPostDto.setContent("Test content");
//         testPostDto.setAuthor("Test Author");
//         testPostDto.setStatus(BlogPost.PostStatus.PUBLISHED);

//         testRequest = new CreateBlogPostRequest();
//         testRequest.setTitle("New Post");
//         testRequest.setContent("New content");
//         testRequest.setAuthor("New Author");
//     }

//     @Test
//     void getAllPosts_ShouldReturnPageOfPosts() {
//         // Given
//         Pageable pageable = PageRequest.of(0, 10);
//         Page<BlogPost> postPage = new PageImpl<>(List.of(testPost));
//         when(blogPostRepository.findAll(pageable)).thenReturn(postPage);
//         when(blogPostMapper.toDto(testPost)).thenReturn(testPostDto);

//         // When
//         Page<BlogPostDto> result = blogPostService.getAllPosts(pageable);

//         // Then
//         assertNotNull(result);
//         assertEquals(1, result.getContent().size());
//         assertEquals(testPostDto.getTitle(), result.getContent().get(0).getTitle());
//         verify(blogPostRepository).findAll(pageable);
//     }

//     @Test
//     void getPostById_WhenPostExists_ShouldReturnPost() {
//         // Given
//         when(blogPostRepository.findById(1L)).thenReturn(Optional.of(testPost));
//         when(blogPostMapper.toDto(testPost)).thenReturn(testPostDto);

//         // When
//         Optional<BlogPostDto> result = blogPostService.getPostById(1L);

//         // Then
//         assertTrue(result.isPresent());
//         assertEquals(testPostDto.getTitle(), result.get().getTitle());
//     }

//     @Test
//     void getPostById_WhenPostNotExists_ShouldReturnEmpty() {
//         // Given
//         when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

//         // When
//         Optional<BlogPostDto> result = blogPostService.getPostById(1L);

//         // Then
//         assertFalse(result.isPresent());
//     }

//     @Test
//     void createPost_ShouldReturnCreatedPost() {
//         // Given
//         when(blogPostMapper.toEntity(testRequest)).thenReturn(testPost);
//         when(blogPostRepository.save(testPost)).thenReturn(testPost);
//         when(blogPostMapper.toDto(testPost)).thenReturn(testPostDto);

//         // When
//         BlogPostDto result = blogPostService.createPost(testRequest);

//         // Then
//         assertNotNull(result);
//         assertEquals(testPostDto.getTitle(), result.getTitle());
//         verify(blogPostRepository).save(testPost);
//     }

//     @Test
//     void publishPost_WhenPostExists_ShouldUpdateStatus() {
//         // Given
//         testPost.setStatus(BlogPost.PostStatus.DRAFT);
//         when(blogPostRepository.findById(1L)).thenReturn(Optional.of(testPost));
//         when(blogPostRepository.save(any(BlogPost.class))).thenReturn(testPost);
//         when(blogPostMapper.toDto(any(BlogPost.class))).thenReturn(testPostDto);

//         // When
//         BlogPostDto result = blogPostService.publishPost(1L);

//         // Then
//         assertEquals(BlogPost.PostStatus.PUBLISHED, testPost.getStatus());
//         verify(blogPostRepository).save(testPost);
//     }

//     @Test
//     void deletePost_WhenPostNotExists_ShouldThrowException() {
//         // Given
//         when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

//         // When & Then
//         assertThrows(ResourceNotFoundException.class, () -> blogPostService.deletePost(1L));
//     }
// }
