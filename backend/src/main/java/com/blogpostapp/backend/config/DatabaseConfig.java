package com.blogpostapp.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import com.blogpostapp.backend.entity.BlogPost;
import com.blogpostapp.backend.repository.BlogPostRepository;
import java.util.Set;

@Configuration
public class DatabaseConfig {
    
    @Bean
    @Profile("!test")
    public CommandLineRunner initData(BlogPostRepository blogPostRepository) {
        return args -> {
            // Create sample blog posts for development
            if (blogPostRepository.count() == 0) {
                BlogPost post1 = new BlogPost();
                post1.setTitle("Welcome to Our Blog");
                post1.setContent("This is our first blog post. We're excited to share our thoughts and ideas with you. Stay tuned for more exciting content!");
                post1.setAuthor("Admin");
                post1.setSummary("Welcome post introducing our new blog");
                post1.setStatus(BlogPost.PostStatus.PUBLISHED);
                post1.setTags(Set.of("welcome", "introduction", "blog"));
                
                BlogPost post2 = new BlogPost();
                post2.setTitle("Spring Boot Best Practices");
                post2.setContent("In this post, we'll explore the best practices for developing Spring Boot applications. We'll cover topics like dependency injection, configuration, testing, and more.");
                post2.setAuthor("John Developer");
                post2.setSummary("A comprehensive guide to Spring Boot best practices");
                post2.setStatus(BlogPost.PostStatus.PUBLISHED);
                post2.setTags(Set.of("spring-boot", "java", "development", "best-practices"));
                
                BlogPost post3 = new BlogPost();
                post3.setTitle("Microservices Architecture");
                post3.setContent("This is a draft post about microservices architecture. We'll discuss the benefits, challenges, and implementation strategies.");
                post3.setAuthor("Jane Architect");
                post3.setSummary("Understanding microservices architecture");
                post3.setStatus(BlogPost.PostStatus.DRAFT);
                post3.setTags(Set.of("microservices", "architecture", "distributed-systems"));
                
                blogPostRepository.save(post1);
                blogPostRepository.save(post2);
                blogPostRepository.save(post3);
            }
        };
    }
}
