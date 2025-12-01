package management.member.demo.normalizer.common;

/**
 * Interface cho Request Normalizer
 * 
 * Enforce contract: void normalize(T request)
 * 
 * Lợi ích:
 * - Dễ test và mock
 * - Dễ mở rộng request type mới
 * - Consistent API cho tất cả normalizers
 * 
 * @param <T> Request type (AddEmployeeRequest, CreateLeaveRequestDTO, etc.)
 */
public interface RequestNormalizer<T> {
    
    /**
     * Normalize request từ FE format → BE format
     * 
     * Nhiệm vụ:
     * - Convert/transform fields từ FE format sang BE format
     * - KHÔNG validate business rules (validation nằm ở Validator layer)
     * - Log rõ ràng khi có field không hợp lệ
     * 
     * @param request Request từ FE (có thể có field không chuẩn)
     * @throws IllegalArgumentException nếu không thể normalize
     */
    void normalize(T request);
}

