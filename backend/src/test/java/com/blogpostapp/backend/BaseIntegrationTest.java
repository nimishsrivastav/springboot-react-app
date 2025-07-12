package com.blogpostapp.backend;

import com.blogpostapp.backend.config.TestConfig;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

/**
 * Base class for integration tests
 * Place this in: backend/src/test/java/com/blogpostapp/backend/BaseIntegrationTest.java
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@ContextConfiguration(classes = {BlogAppApplication.class, TestConfig.class})
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class BaseIntegrationTest {
    
    // Common test setup and utilities can go here
    // All integration tests can extend this class
    
}