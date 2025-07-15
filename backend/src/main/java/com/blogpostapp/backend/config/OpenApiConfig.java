package com.blogpostapp.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Value("${server.port:8080}")
    private String serverPort;
    
    @Bean
    public OpenAPI blogPostAppOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:" + serverPort);
        devServer.setDescription("Development server");

        // Contact contact = new Contact();
        // contact.setEmail("support@blogapp.com");
        // contact.setName("Blog App Support");
        // contact.setUrl("https://www.blogapp.com");

        License mitLicense = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("Blog Post Management API")
                .version("1.0")
                // .contact(contact)
                .description("This API exposes endpoints to manage blog posts and comments.")
                .license(mitLicense);

        return new OpenAPI().info(info).servers(List.of(devServer));
    }
}
