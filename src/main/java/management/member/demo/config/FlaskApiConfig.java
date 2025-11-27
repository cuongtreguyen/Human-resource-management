package management.member.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class FlaskApiConfig {

    @Value("${flask.api.base-url}")
    private String flaskApiBaseUrl;

    @Value("${flask.api.timeout}")
    private int timeout;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getFlaskApiBaseUrl() {
        return flaskApiBaseUrl;
    }

    public int getTimeout() {
        return timeout;
    }
}
