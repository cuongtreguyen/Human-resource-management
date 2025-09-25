package management.member.demo.security;

import org.springframework.stereotype.Component;

/**
 * Engine xử lý các chính sách phân quyền (Policy-Based Access Control)
 * Kiểm tra quyền truy cập dựa trên role của user, resource và action
 */
@Component
public class PolicyEngine {

    /**
     * Kiểm tra quyền truy cập của user đến resource với action cụ thể
     * @param userRole vai trò của user (ADMIN, MANAGER, EMPLOYEE)
     * @param resource tài nguyên cần truy cập
     * @param action hành động cần thực hiện (VIEW, CREATE, UPDATE, DELETE)
     * @return true nếu có quyền truy cập, false nếu không có quyền
     */
    public boolean checkAccess(String userRole, String resource, String action) {
        // ADMIN có toàn quyền truy cập
        if ("ADMIN".equalsIgnoreCase(userRole)) {
            return true;
        }

        // MANAGER có quyền xem và quản lý nhân viên
        if ("MANAGER".equalsIgnoreCase(userRole)) {
            return "VIEW".equalsIgnoreCase(action) || "MANAGE_EMPLOYEES".equalsIgnoreCase(action);
        }

        // EMPLOYEE chỉ được xem thông tin của chính mình
        if ("EMPLOYEE".equalsIgnoreCase(userRole) && "VIEW_SELF".equalsIgnoreCase(action)) {
            return true;
        }

        // Mặc định không có quyền truy cập
        return false;
    }
}
