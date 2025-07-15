package com.blogpostapp.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.authorization.event.AuthorizationDeniedEvent;
import org.springframework.stereotype.Component;

@Component
public class SecurityEventListener {

    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY");

    @EventListener
    public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
        securityLogger.info("Authentication successful for user: {} from IP: {}", 
            event.getAuthentication().getName(),
            getClientIP());
    }

    @EventListener
    public void onAuthenticationFailure(AbstractAuthenticationFailureEvent event) {
        securityLogger.warn("Authentication failed for user: {} from IP: {}. Reason: {}", 
            event.getAuthentication().getName(),
            getClientIP(),
            event.getException().getMessage());
    }

    @EventListener
    public void onAuthorizationDenied(AuthorizationDeniedEvent event) {
        securityLogger.warn("Access denied for user: {} to resource: {} from IP: {}", 
            event.getAuthentication().get().getName(),
            event.getAuthorizationDecision(),
            getClientIP());
    }

    private String getClientIP() {
        // This would be properly implemented with request context
        return "unknown";
    }
}
