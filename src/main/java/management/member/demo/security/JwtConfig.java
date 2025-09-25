package management.member.demo.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "security.jwt")
public class JwtConfig {
    private String issuer;
    private long accessTokenTtl;   // seconds
    private long refreshTokenTtl;  // seconds
    private String kmsKeyId;       // AWS KMS key for signing
}
