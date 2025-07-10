package com.blogpostapp.backend.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "com.blogpostapp.backend.mapper")
public class MapStructConfig {
    // This ensures MapStruct mappers are properly scanned as Spring components
}
