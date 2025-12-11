package management.member.demo.config;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

/**
 * Configuration cho Multipart File Upload
 * Tối ưu hóa để hỗ trợ upload file lớn với tốc độ cao
 */
@Configuration
public class MultipartConfig {

    @Value("${spring.servlet.multipart.max-file-size:10GB}")
    private String maxFileSize;

    @Value("${spring.servlet.multipart.max-request-size:10GB}")
    private String maxRequestSize;

    @Value("${spring.servlet.multipart.file-size-threshold:10MB}")
    private String fileSizeThreshold;

    /**
     * Cấu hình MultipartConfigElement để tối ưu upload file lớn
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        
        // Kích thước file tối đa: 10GB
        factory.setMaxFileSize(DataSize.parse(maxFileSize));
        
        // Kích thước request tối đa: 10GB
        factory.setMaxRequestSize(DataSize.parse(maxRequestSize));
        
        // Threshold: File lớn hơn 10MB sẽ được lưu vào disk thay vì memory
        factory.setFileSizeThreshold(DataSize.parse(fileSizeThreshold));
        
        // Location để lưu file tạm (sẽ dùng system temp directory)
        factory.setLocation(System.getProperty("java.io.tmpdir"));
        
        return factory.createMultipartConfig();
    }

    /**
     * StandardServletMultipartResolver với cấu hình tối ưu
     */
    @Bean
    public StandardServletMultipartResolver multipartResolver() {
        StandardServletMultipartResolver resolver = new StandardServletMultipartResolver();
        resolver.setResolveLazily(false); // Resolve ngay lập tức để tối ưu
        return resolver;
    }
}

