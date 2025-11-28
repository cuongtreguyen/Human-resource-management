package management.member.demo.config;

import management.member.demo.converter.EmployeeStatusConverter;
import management.member.demo.converter.PayrollStatusConverter;
import management.member.demo.converter.SalaryStatusConverter;
import management.member.demo.exception.util.TraceIdUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;

/**
 * Configuration để tự động tạo và quản lý Trace ID cho mỗi request
 * Và đăng ký Spring Web Converters cho HTTP param parsing
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    /**
     * Đăng ký Spring Web Converters để parse HTTP params → Enum
     * Chạy ở tầng Web MVC
     */
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new EmployeeStatusConverter());
        registry.addConverter(new PayrollStatusConverter());
        registry.addConverter(new SalaryStatusConverter());
    }
    
    /**
     * Filter để tự động tạo Trace ID cho mỗi request
     */
    @Bean
    public FilterRegistrationBean<TraceIdFilter> traceIdFilter() {
        FilterRegistrationBean<TraceIdFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new TraceIdFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }
    
    /**
     * Filter để tạo Trace ID từ header hoặc tạo mới
     */
    public static class TraceIdFilter extends OncePerRequestFilter {
        
        private static final String TRACE_ID_HEADER = "X-Trace-Id";
        
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                     FilterChain filterChain) throws ServletException, IOException {
            try {
                // Lấy Trace ID từ header hoặc tạo mới
                String traceId = request.getHeader(TRACE_ID_HEADER);
                if (traceId == null || traceId.isEmpty()) {
                    traceId = TraceIdUtil.generateTraceId();
                } else {
                    TraceIdUtil.setTraceId(traceId);
                }
                
                // Thêm Trace ID vào response header
                response.setHeader(TRACE_ID_HEADER, traceId);
                
                filterChain.doFilter(request, response);
            } finally {
                // Xóa Trace ID sau khi request hoàn thành
                TraceIdUtil.clearTraceId();
            }
        }
    }
}

