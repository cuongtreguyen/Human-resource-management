package management.member.demo.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimitConfig {
    
    // Rate limiting configuration properties
    public static final int LOGIN_RATE_LIMIT = 5;
    public static final int API_RATE_LIMIT = 100;
    public static final int RATE_LIMIT_WINDOW_MINUTES = 1;
    
    // TODO: Implement rate limiting with Redis or in-memory cache
    // For now, this is a placeholder configuration
}
