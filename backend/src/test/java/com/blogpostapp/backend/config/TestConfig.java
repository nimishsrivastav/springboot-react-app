package com.blogpostapp.backend.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

/**
 * Base test configuration class for integration tests
 */
@TestConfiguration
@ActiveProfiles("test")
@EnableTransactionManagement
public class TestConfig {
    
    // Any test-specific beans can be defined here
    // For example, mock services, test data factories, etc.
    
}
