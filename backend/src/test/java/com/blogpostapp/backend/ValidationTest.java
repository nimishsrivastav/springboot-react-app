package com.blogpostapp.backend;

import com.blogpostapp.backend.dto.BlogPostDto;
import com.blogpostapp.backend.dto.CommentDto;
import com.blogpostapp.backend.dto.CreateBlogPostRequest;
import com.blogpostapp.backend.entity.BlogPost;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ValidationTest {

    @Autowired
    private Validator validator;

    private CreateBlogPostRequest validCreateRequest;
    private BlogPostDto validBlogPostDto;
    private CommentDto validCommentDto;

    @BeforeEach
    void setUp() {
        validCreateRequest = new CreateBlogPostRequest();
        validCreateRequest.setTitle("Valid Blog Post Title");
        validCreateRequest.setContent("This is valid content that meets the minimum length requirement for blog posts");
        validCreateRequest.setAuthor("Valid Author");
        validCreateRequest.setSummary("Valid summary");

        validBlogPostDto = new BlogPostDto();
        validBlogPostDto.setTitle("Valid Blog Post Title");
        validBlogPostDto.setContent("This is valid content that meets the minimum length requirement for blog posts");
        validBlogPostDto.setAuthor("Valid Author");
        validBlogPostDto.setSummary("Valid summary");

        validCommentDto = new CommentDto();
        validCommentDto.setContent("This is a valid comment");
        validCommentDto.setAuthorName("Valid Commenter");
        validCommentDto.setAuthorEmail("valid@example.com");
    }

    // ========== CreateBlogPostRequest Validation Tests ==========

    @Test
    void createBlogPostRequest_WithValidData_ShouldPassValidation() {
        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void createBlogPostRequest_WithBlankTitle_ShouldFailValidation() {
        // Given
        validCreateRequest.setTitle("");

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Title is required")));
    }

    @Test
    void createBlogPostRequest_WithNullTitle_ShouldFailValidation() {
        // Given
        validCreateRequest.setTitle(null);

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Title is required")));
    }

    @Test
    void createBlogPostRequest_WithTitleTooShort_ShouldFailValidation() {
        // Given
        validCreateRequest.setTitle("Bad"); // 3 characters, minimum is 5

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Title must be between 5 and 100 characters")));
    }

    @Test
    void createBlogPostRequest_WithTitleTooLong_ShouldFailValidation() {
        // Given
        validCreateRequest.setTitle("A".repeat(101)); // 101 characters, maximum is 100

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Title must be between 5 and 100 characters")));
    }

    @Test
    void createBlogPostRequest_WithContentTooShort_ShouldFailValidation() {
        // Given
        validCreateRequest.setContent("Short"); // 5 characters, minimum is 10

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Content must be at least 10 characters")));
    }

    @Test
    void createBlogPostRequest_WithBlankContent_ShouldFailValidation() {
        // Given
        validCreateRequest.setContent("");

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Content is required")));
    }

    @Test
    void createBlogPostRequest_WithNullContent_ShouldFailValidation() {
        // Given
        validCreateRequest.setContent(null);

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Content is required")));
    }

    @Test
    void createBlogPostRequest_WithAuthorTooShort_ShouldFailValidation() {
        // Given
        validCreateRequest.setAuthor("A"); // 1 character, minimum is 2

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Author name must be between 2 and 50 characters")));
    }

    @Test
    void createBlogPostRequest_WithAuthorTooLong_ShouldFailValidation() {
        // Given
        validCreateRequest.setAuthor("A".repeat(51)); // 51 characters, maximum is 50

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Author name must be between 2 and 50 characters")));
    }

    @Test
    void createBlogPostRequest_WithBlankAuthor_ShouldFailValidation() {
        // Given
        validCreateRequest.setAuthor("");

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Author is required")));
    }

    @Test
    void createBlogPostRequest_WithNullAuthor_ShouldFailValidation() {
        // Given
        validCreateRequest.setAuthor(null);

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Author is required")));
    }

    @Test
    void createBlogPostRequest_WithSummaryTooLong_ShouldFailValidation() {
        // Given
        validCreateRequest.setSummary("A".repeat(201)); // 201 characters, maximum is 200

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Summary cannot exceed 200 characters")));
    }

    @Test
    void createBlogPostRequest_WithNullSummary_ShouldPassValidation() {
        // Given
        validCreateRequest.setSummary(null); // Summary is optional

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void createBlogPostRequest_WithEmptySummary_ShouldPassValidation() {
        // Given
        validCreateRequest.setSummary(""); // Empty summary is acceptable

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    // ========== BlogPostDto Validation Tests ==========

    @Test
    void blogPostDto_WithValidData_ShouldPassValidation() {
        // When
        Set<ConstraintViolation<BlogPostDto>> violations = validator.validate(validBlogPostDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void blogPostDto_WithBlankTitle_ShouldFailValidation() {
        // Given
        validBlogPostDto.setTitle("");

        // When
        Set<ConstraintViolation<BlogPostDto>> violations = validator.validate(validBlogPostDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Title is required")));
    }

    @Test
    void blogPostDto_WithTitleTooShort_ShouldFailValidation() {
        // Given
        validBlogPostDto.setTitle("Test"); // 4 characters, minimum is 5

        // When
        Set<ConstraintViolation<BlogPostDto>> violations = validator.validate(validBlogPostDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Title must be between 5 and 100 characters")));
    }

    @Test
    void blogPostDto_WithContentTooShort_ShouldFailValidation() {
        // Given
        validBlogPostDto.setContent("Too short"); // 9 characters, minimum is 10

        // When
        Set<ConstraintViolation<BlogPostDto>> violations = validator.validate(validBlogPostDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Content must be at least 10 characters")));
    }

    @Test
    void blogPostDto_WithAuthorTooLong_ShouldFailValidation() {
        // Given
        validBlogPostDto.setAuthor("A".repeat(51)); // 51 characters, maximum is 50

        // When
        Set<ConstraintViolation<BlogPostDto>> violations = validator.validate(validBlogPostDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Author name must be between 2 and 50 characters")));
    }

    @Test
    void blogPostDto_WithMultipleValidationErrors_ShouldReturnAllErrors() {
        // Given
        validBlogPostDto.setTitle(""); // Blank title
        validBlogPostDto.setContent("Short"); // Too short content
        validBlogPostDto.setAuthor("A".repeat(51)); // Too long author

        // When
        Set<ConstraintViolation<BlogPostDto>> violations = validator.validate(validBlogPostDto);

        // Then
        assertFalse(violations.isEmpty());
        assertEquals(3, violations.size()); // Should have 3 validation errors
    }

    // ========== CommentDto Validation Tests ==========

    @Test
    void commentDto_WithValidData_ShouldPassValidation() {
        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithBlankContent_ShouldFailValidation() {
        // Given
        validCommentDto.setContent("");

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Content is required")));
    }

    @Test
    void commentDto_WithNullContent_ShouldFailValidation() {
        // Given
        validCommentDto.setContent(null);

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Content is required")));
    }

    @Test
    void commentDto_WithContentTooLong_ShouldFailValidation() {
        // Given
        validCommentDto.setContent("A".repeat(501)); // 501 characters, maximum is 500

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Comment must be between 1 and 500 characters")));
    }

    @Test
    void commentDto_WithBlankAuthorName_ShouldFailValidation() {
        // Given
        validCommentDto.setAuthorName("");

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Author name is required")));
    }

    @Test
    void commentDto_WithNullAuthorName_ShouldFailValidation() {
        // Given
        validCommentDto.setAuthorName(null);

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Author name is required")));
    }

    @Test
    void commentDto_WithAuthorNameTooShort_ShouldFailValidation() {
        // Given
        validCommentDto.setAuthorName("A"); // 1 character, minimum is 2

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Author name must be between 2 and 50 characters")));
    }

    @Test
    void commentDto_WithAuthorNameTooLong_ShouldFailValidation() {
        // Given
        validCommentDto.setAuthorName("A".repeat(51)); // 51 characters, maximum is 50

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Author name must be between 2 and 50 characters")));
    }

    @Test
    void commentDto_WithEmailTooLong_ShouldFailValidation() {
        // Given
        validCommentDto.setAuthorEmail("A".repeat(95) + "@example.com"); // > 100 characters total

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
            v.getMessage().contains("Email cannot exceed 100 characters")));
    }

    @Test
    void commentDto_WithNullEmail_ShouldPassValidation() {
        // Given
        validCommentDto.setAuthorEmail(null); // Email is optional

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithEmptyEmail_ShouldPassValidation() {
        // Given
        validCommentDto.setAuthorEmail(""); // Empty email is acceptable

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithMultipleValidationErrors_ShouldReturnAllErrors() {
        // Given
        validCommentDto.setContent(""); // Blank content
        validCommentDto.setAuthorName("A"); // Too short author name
        validCommentDto.setAuthorEmail("A".repeat(101)); // Too long email

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertEquals(3, violations.size()); // Should have 3 validation errors
    }

    // ========== Boundary Value Tests ==========

    @Test
    void createBlogPostRequest_WithMinimumValidValues_ShouldPassValidation() {
        // Test minimum valid values
        validCreateRequest.setTitle("12345"); // Exactly 5 characters
        validCreateRequest.setContent("1234567890"); // Exactly 10 characters
        validCreateRequest.setAuthor("AB"); // Exactly 2 characters

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void createBlogPostRequest_WithMaximumValidValues_ShouldPassValidation() {
        // Test maximum valid values
        validCreateRequest.setTitle("A".repeat(100)); // Exactly 100 characters
        validCreateRequest.setAuthor("A".repeat(50)); // Exactly 50 characters
        validCreateRequest.setSummary("A".repeat(200)); // Exactly 200 characters

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithMinimumValidValues_ShouldPassValidation() {
        // Test boundary values for comment
        validCommentDto.setContent("A"); // Exactly 1 character (minimum)
        validCommentDto.setAuthorName("AB"); // Exactly 2 characters (minimum)

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithMaximumValidValues_ShouldPassValidation() {
        // Given
        validCommentDto.setContent("A".repeat(500)); // Exactly 500 characters
        validCommentDto.setAuthorName("A".repeat(50)); // Exactly 50 characters
        validCommentDto.setAuthorEmail("A".repeat(91) + "@test.com"); // Exactly 100 characters

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    // ========== Special Characters Tests ==========

    @Test
    void createBlogPostRequest_WithSpecialCharacters_ShouldPassValidation() {
        // Test with special characters
        validCreateRequest.setTitle("Blog Post: Testing & Validation!");
        validCreateRequest.setContent("Content with special chars: @#$%^&*()_+ and unicode: 中文");
        validCreateRequest.setAuthor("User123-_");
        validCreateRequest.setSummary("Summary with special chars: <>?\"{}|");

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithSpecialCharacters_ShouldPassValidation() {
        // Test with special characters
        validCommentDto.setContent("Comment with emojis 😀😃😄 and special chars!");
        validCommentDto.setAuthorName("User-Name_123");
        validCommentDto.setAuthorEmail("user+tag@sub.domain.com");

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void createBlogPostRequest_WithUnicodeCharacters_ShouldPassValidation() {
        // Test with unicode characters
        validCreateRequest.setTitle("博客文章标题测试");
        validCreateRequest.setContent("这是一个包含中文字符的博客文章内容测试，验证unicode字符处理能力");
        validCreateRequest.setAuthor("用户名测试");

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithUnicodeAndEmojis_ShouldPassValidation() {
        // Test with unicode and emojis
        validCommentDto.setContent("这是一个测试评论 with emojis 🎉🎊✨ and mixed languages!");
        validCommentDto.setAuthorName("测试用户123");
        validCommentDto.setAuthorEmail("测试@example.com");

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }

    // ========== Edge Cases Tests ==========

    @Test
    void createBlogPostRequest_WithWhitespaceOnlyTitle_ShouldFailValidation() {
        // Given
        validCreateRequest.setTitle("     "); // Only whitespace

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Title is required")));
    }

    @Test
    void commentDto_WithWhitespaceOnlyContent_ShouldFailValidation() {
        // Given
        validCommentDto.setContent("     "); // Only whitespace

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Content is required")));
    }

    @Test
    void createBlogPostRequest_WithNewlineCharacters_ShouldPassValidation() {
        // Test with newline characters
        validCreateRequest.setTitle("Blog Post\nWith Newlines");
        validCreateRequest.setContent("Content with\nmultiple\nlines\nand proper length");
        validCreateRequest.setAuthor("Author\nName");

        // When
        Set<ConstraintViolation<CreateBlogPostRequest>> violations = validator.validate(validCreateRequest);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    void commentDto_WithTabAndSpaceCharacters_ShouldPassValidation() {
        // Test with tab and space characters
        validCommentDto.setContent("Comment\twith\ttabs\tand    spaces");
        validCommentDto.setAuthorName("User\tName");

        // When
        Set<ConstraintViolation<CommentDto>> violations = validator.validate(validCommentDto);

        // Then
        assertTrue(violations.isEmpty());
    }
}