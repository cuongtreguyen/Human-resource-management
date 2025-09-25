package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
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

    /** Tên đăng nhập của user (duy nhất) */
    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String username;

    /** Mật khẩu đã được mã hóa của user */
    @NotBlank
    @Size(max = 100)
    private String password;

    /** Email của user (duy nhất) */
    @Email
    @Size(max = 100)
    @Column(unique = true)
    private String email;

    /** Tên của user */
    @Size(max = 100)
    private String firstName;

    /** Họ của user */
    @Size(max = 100)
    private String lastName;

    /** Trạng thái hoạt động của user (true = hoạt động, false = bị vô hiệu hóa) */
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    /** Trạng thái khóa tài khoản (true = bị khóa, false = không bị khóa) */
    @Column(name = "is_locked")
    private Boolean isLocked = false;
    
    /** Số lần đăng nhập thất bại liên tiếp */
    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;
    
    /** Thời gian đăng nhập cuối cùng */
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    /** Thời gian tạo user (tự động, không thể cập nhật) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    /** Thời gian cập nhật cuối cùng (tự động) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
