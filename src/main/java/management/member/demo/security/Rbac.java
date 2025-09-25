package management.member.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Component xử lý Role-Based Access Control (RBAC)
 * Cung cấp interface đơn giản để kiểm tra quyền truy cập dựa trên role
 */
@Component
public class Rbac {

    private final PolicyEngine policyEngine;

    @Autowired
    public Rbac(PolicyEngine policyEngine) {
        this.policyEngine = policyEngine;
    }

    /**
     * Kiểm tra quyền truy cập của user dựa trên role
     * @param userRole vai trò của user
     * @param resource tài nguyên cần truy cập
     * @param action hành động cần thực hiện
     * @return true nếu có quyền truy cập, false nếu không có quyền
     */
    public boolean hasAccess(String userRole, String resource, String action) {
        return policyEngine.checkAccess(userRole, resource, action);
    }
}
