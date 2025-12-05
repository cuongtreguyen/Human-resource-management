package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.Role;
import management.member.demo.enums.SystemStatusType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho User trong hệ thống HRM
 * Chứa thông tin cơ bản của user và các trường audit
 */
@Getter
@Setter
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    /** ID duy nhất của user */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Mật khẩu đã được mã hóa của user */
    @NotBlank
    @Size(max = 100)
    private String password;

    /** Email của user (duy nhất) */
    @Email
    @Size(max = 100)
    @Column(unique = true)
    private String email;

    /** Tên đầy đủ của user (lấy từ Employee.fullName khi có Employee) */
    @Size(max = 200)
    @Column(name = "full_name")
    private String fullName;

    /** Employee ID (String) - lưu từ Employee.employeeId */
    @Size(max = 50)
    @Column(name = "employee_id")
    private String employeeId;

    /** Trạng thái hoạt động của user (true = hoạt động, false = bị vô hiệu hóa) */
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    /** Trạng thái khóa tài khoản (true = bị khóa, false = không bị khóa) */
    @Column(name = "is_locked")
    private Boolean isLocked = false;
    
    /** Thời gian tài khoản bị khóa */
    @Column(name = "locked_at")
    private LocalDateTime lockedAt;
    
    /** Số lần đăng nhập thất bại liên tiếp */
    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;
    
    /** Thời gian đăng nhập cuối cùng */
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    /** Vai trò của user (ADMIN, EMPLOYEE) */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "employees_id",
            referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_users_employee")
    )
    private Employee employee;

    /** Trạng thái hệ thống của user (IDLE, RUNNING, SUCCESS, ERROR) */
    @Convert(converter = management.member.demo.converter.SystemStatusTypeAttributeConverter.class)
    @Column(name = "system_status")
    private SystemStatusType systemStatus;
    
    /** Thời gian tạo user (tự động, không thể cập nhật) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    /** Thời gian cập nhật cuối cùng (tự động) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
}
