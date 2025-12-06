package management.member.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.enums.EmployeeType;
import management.member.demo.enums.Role;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

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
    @Column(name = "id_card")
    private String idCard;

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
    @Column(name = "id_card_issue_date")
    private LocalDate idCardIssueDate;

    /** Nơi cấp CMND/CCCD */
    @Size(max = 100)
    @Column(name = "id_card_issue_place")
    private String idCardIssuePlace;

    /** Số ngày nghỉ phép còn lại trong năm */
    @Column(name = "remaining_leave_days")
    private Integer remainingLeaveDays = 12; // Mặc định 12 ngày


    /** Quản lý trực tiếp */
    @Size(max = 255)
    @Column(name = "manager")
    private String manager;

    /** Tình trạng hôn nhân */
    @Column(name = "marital_status")
    private String  maritalStatus;

    /** Loại nhân viên */
    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type")
    private EmployeeType employeeType;

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


    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;


    @Column(name = "address")
    private String address;

    /** Địa điểm làm việc */
    @Size(max = 255)
    @Column(name = "work_location")
    private String workLocation;

    /** Giờ vào làm */
    @Column(name = "time_in")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime timeIn;

    /** Giờ tan ca */
    @Column(name = "time_out")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime timeOut;

    /** Ca làm việc */
    @Size(max = 50)
    @Column(name = "shift")
    private String shift;

    /** Số ngày nghỉ (tính từ checkIn so với timeIn, nếu chênh lệch > 120 phút) */
    @Size(max = 255)
    @Column(name = "day_off")
    private String dayOff;

    /** Số ngày đi muộn (đếm từ Attendance có status = LATE) */
    @Size(max = 255)
    @Column(name = "late_day")
    private String lateDay;


    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmployeeInsuranceContract> insurances = new ArrayList<>();

    /** Quan hệ One-to-One với User (inverse side) */
    @OneToOne(mappedBy = "employee", fetch = FetchType.LAZY)
    private User user;

}