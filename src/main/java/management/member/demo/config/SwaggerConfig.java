package management.member.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI hrmOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HRM API")
                        .description("Human Resource Management System API Documentation")
                        .version("v1.0.0"));
    }
}
