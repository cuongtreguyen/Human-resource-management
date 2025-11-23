package management.member.demo.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String jdbcUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Set system timezone trước khi tạo connection
        System.setProperty("user.timezone", "UTC");
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("UTC"));
        
        HikariConfig config = new HikariConfig();
        // Đảm bảo URL có TimeZone=UTC
        String url = jdbcUrl;
        if (!url.contains("TimeZone=")) {
            url += (url.contains("?") ? "&" : "?") + "TimeZone=UTC";
        }
        // Xóa các TimeZone khác nếu có và thay bằng UTC
        url = url.replaceAll("TimeZone=[^&]*", "TimeZone=UTC");
        if (!url.contains("TimeZone=")) {
            url += (url.contains("?") ? "&" : "?") + "TimeZone=UTC";
        }
        
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName(driverClassName);
        // Không dùng connectionInitSql vì có thể gây conflict
        return new HikariDataSource(config);
    }
}

