package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.enums.Role;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Họ và tên */
    @NotBlank
    @Size(max = 200)
    @Column(name = "full_name")
    private String fullName;

    /** Tên */
    @Size(max = 100)
    @Column(name = "first_name")
    private String firstName;

    /** Họ */
    @Size(max = 100)
    @Column(name = "last_name")
    private String lastName;

    /** Email công việc */
    @Email
    @NotBlank
    @Size(max = 120)
    @Column(unique = true)
    private String email;

    /** Email cá nhân */
    @Email
    @Size(max = 120)
    @Column(name = "personal_email")
    private String personalEmail;

    /** Số điện thoại */
    @Size(max = 30)
    private String phone;

    /** Địa chỉ thường trú */
    @Size(max = 255)
    @Column(name = "permanent_address")
    private String permanentAddress;

    /** Địa chỉ tạm trú */
    @Size(max = 255)
    @Column(name = "temporary_address")
    private String temporaryAddress;

    /** Ngày sinh */
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    /** Giới tính */
    @Size(max = 10)
    private String gender;

    /** Số CMND/CCCD */
    @Size(max = 20)
    @Column(name = "id_number")
    private String idNumber;

    /** Mã số thuế */
    @Size(max = 20)
    @Column(name = "tax_code")
    private String taxCode;

    /** ID nhân viên (String) */
    @Size(max = 50)
    @Column(name = "employee_id")
    private String employeeId;

    /** Mã hợp đồng */
    @Size(max = 50)
    @Column(name = "contract_code")
    private String contractCode;

    /** Loại hợp đồng */
    @Size(max = 50)
    @Column(name = "contract_type")
    private String contractType;

    /** Phòng ban */
    @NotBlank
    @Size(max = 100)
    private String department;

    /** Chức vụ */
    @NotBlank
    @Size(max = 100)
    private String position;

    /** Ngày bắt đầu làm việc */
    @NotNull
    @Column(name = "hire_date")
    private LocalDate hireDate;

    /** Trạng thái */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EmployeeStatus status;

    /** Lương cơ bản */
    @NotNull
    @Column(name = "base_salary", precision = 19, scale = 2)
    private BigDecimal baseSalary;

    /** Ngày cấp CMND/CCCD */
    @Column(name = "id_issue_date")
    private LocalDate idIssueDate;

    /** Nơi cấp CMND/CCCD */
    @Size(max = 100)
    @Column(name = "id_issue_place")
    private String idIssuePlace;

    /** Số ngày nghỉ phép còn lại trong năm */
    private int remainingLeaveDays = 12;

    /** Địa chỉ văn phòng */
    @Size(max = 255)
    @Column(name = "office_address")
    private String officeAddress;

    /** Quản lý trực tiếp */
    @Size(max = 255)
    @Column(name = "direct_manager")
    private String directManager;

    /** Tình trạng hôn nhân */
    @Column(name = "marital_status")
    private Boolean maritalStatus;

    /** Loại nhân viên */
    @Size(max = 100)
    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type")
    private EmployeeStatus employeeType;

    /** Tên người liên hệ khẩn cấp */
    @Size(max = 100)
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    /** Số điện thoại người liên hệ khẩn cấp */
    @Size(max = 30)
    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    /** Mối quan hệ ng liên hệ khẩn cấp */
    @Size(max = 50)
    @Column(name = "emergency_contact_relationship")
    private String emergencyContactRelationship;

    /** Số giờ OT còn lại trong tháng */
    @Column(name = "remaining_ot_hours")
    private Integer remainingOtHours = 40;

    /** Vai trò của user (ADMIN, EMPLOYEE) */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "employee_code")
    private String employeeCode;

    @Column(name = "address")
    private String address;
}