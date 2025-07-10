// package com.blogpostapp.backend;

// import com.blogpostapp.backend.controller.BlogPostController;
// import com.blogpostapp.backend.dto.BlogPostDto;
// import com.blogpostapp.backend.dto.CreateBlogPostRequest;
// import com.blogpostapp.backend.entity.BlogPost;
// import com.blogpostapp.backend.service.interfaces.BlogPostService;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;

// import java.util.List;
// import java.util.Optional;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.eq;
// import static org.mockito.Mockito.when;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(BlogPostController.class)
// @ActiveProfiles("test")
// class BlogPostControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private BlogPostService blogPostService;

//     @Autowired
//     private ObjectMapper objectMapper;

//     private BlogPostDto testPostDto;
//     private CreateBlogPostRequest testRequest;

//     @BeforeEach
//     void setUp() {
//         testPostDto = new BlogPostDto();
//         testPostDto.setId(1L);
//         testPostDto.setTitle("Test Post");
//         testPostDto.setContent("Test content");
//         testPostDto.setAuthor("Test Author");
//         testPostDto.setStatus(BlogPost.PostStatus.PUBLISHED);

//         testRequest = new CreateBlogPostRequest();
//         testRequest.setTitle("New Post");
//         testRequest.setContent("New content for testing");
//         testRequest.setAuthor("New Author");
//     }

//     @Test
//     void getAllPosts_ShouldReturnPageOfPosts() throws Exception {
//         // Given
//         Page<BlogPostDto> postPage = new PageImpl<>(List.of(testPostDto));
//         when(blogPostService.getAllPosts(any())).thenReturn(postPage);

//         // When & Then
//         mockMvc.perform(get("/api/v1/posts"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.content[0].title").value("Test Post"))
//                 .andExpect(jsonPath("$.content[0].author").value("Test Author"));
//     }

//     @Test
//     void getPostById_WhenPostExists_ShouldReturnPost() throws Exception {
//         // Given
//         when(blogPostService.getPostById(1L)).thenReturn(Optional.of(testPostDto));
//         when(blogPostService.incrementViewCount(1L)).thenReturn(testPostDto);

//         // When & Then
//         mockMvc.perform(get("/api/v1/posts/1"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.title").value("Test Post"))
//                 .andExpect(jsonPath("$.author").value("Test Author"));
//     }

//     @Test
//     void getPostById_WhenPostNotExists_ShouldReturnNotFound() throws Exception {
//         // Given
//         when(blogPostService.getPostById(1L)).thenReturn(Optional.empty());

//         // When & Then
//         mockMvc.perform(get("/api/v1/posts/1"))
//                 .andExpect(status().isNotFound());
//     }

//     @Test
//     void createPost_WithValidData_ShouldReturnCreatedPost() throws Exception {
//         // Given
//         when(blogPostService.createPost(any(CreateBlogPostRequest.class))).thenReturn(testPostDto);

//         // When & Then
//         mockMvc.perform(post("/api/v1/posts")
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(objectMapper.writeValueAsString(testRequest)))
//                 .andExpect(status().isCreated())
//                 .andExpect(jsonPath("$.title").value("Test Post"));
//     }

//     @Test
//     void createPost_WithInvalidData_ShouldReturnBadRequest() throws Exception {
//         // Given
//         testRequest.setTitle(""); // Invalid title

//         // When & Then
//         mockMvc.perform(post("/api/v1/posts")
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(objectMapper.writeValueAsString(testRequest)))
//                 .andExpect(status().isBadRequest());
//     }

//     @Test
//     void publishPost_ShouldReturnUpdatedPost() throws Exception {
//         // Given
//         testPostDto.setStatus(BlogPost.PostStatus.PUBLISHED);
//         when(blogPostService.publishPost(1L)).thenReturn(testPostDto);

//         // When & Then
//         mockMvc.perform(patch("/api/v1/posts/1/publish"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.status").value("PUBLISHED"));
//     }

//     @Test
//     void deletePost_ShouldReturnNoContent() throws Exception {
//         // When & Then
//         mockMvc.perform(delete("/api/v1/posts/1"))
//                 .andExpect(status().isNoContent());
//     }
// }
