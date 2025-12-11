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
    @Column(name = "phone")
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
    @Column(name = "gender")
    private String gender;

    /** Số CMND/CCCD */
    @Size(max = 20)
    @Column(name = "id_card")
    private String idCard;

    /** Mã số thuế */
    @Size(max = 20)
    @Column(name = "tax_code")
    private String taxCode;

    /** ID nhân viên (String dinh dang EMP***) */
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
    @Column(name = "department")
    private String department;

    /** Chức vụ */
    @NotBlank
    @Size(max = 100)
    @Column(name = "position")
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


    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmployeeInsuranceContract> insurances = new ArrayList<>();

    /** Quan hệ One-to-Many với Salary: 1 nhân viên có thể có nhiều bản ghi lương */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<Salary> salaries = new ArrayList<>();

    /** Quan hệ One-to-One với User (inverse side) */
    @OneToOne(mappedBy = "employee", fetch = FetchType.LAZY)
    private User user;

    /** Quan hệ One-to-Many với Attendance: 1 nhân viên có thể có nhiều bản ghi chấm công */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<Attendance> attendances = new ArrayList<>();

    /** Quan hệ One-to-Many với OnLeave: 1 nhân viên có thể có nhiều đơn nghỉ phép */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<OnLeave> onLeaves = new ArrayList<>();

    /** Quan hệ One-to-Many với OverTime (employee): 1 nhân viên có thể có nhiều yêu cầu OT */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<OverTime> overTimes = new ArrayList<>();

    /** Quan hệ One-to-Many với OverTime (approvedBy): 1 nhân viên có thể duyệt nhiều yêu cầu OT */
    @OneToMany(mappedBy = "approvedBy", fetch = FetchType.LAZY)
    private List<OverTime> approvedOverTimes = new ArrayList<>();

    /** Quan hệ One-to-Many với EmployeeEvaluation: 1 nhân viên có thể có nhiều đánh giá */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<EmployeeEvaluation> employeeEvaluations = new ArrayList<>();

    /** Quan hệ One-to-Many với SupportTicket: 1 nhân viên có thể tạo nhiều ticket hỗ trợ */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<SupportTicket> supportTickets = new ArrayList<>();

    /** Quan hệ One-to-Many với SupportRequest: 1 nhân viên có thể gửi nhiều yêu cầu hỗ trợ */
    @OneToMany(mappedBy = "requester", fetch = FetchType.LAZY)
    private List<SupportRequest> supportRequests = new ArrayList<>();

    /** Quan hệ One-to-Many với Evaluation (employee): 1 nhân viên có thể được đánh giá nhiều lần */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<Evaluation> evaluations = new ArrayList<>();

    /** Quan hệ One-to-Many với Evaluation (evaluator): 1 nhân viên có thể đánh giá nhiều nhân viên khác */
    @OneToMany(mappedBy = "evaluator", fetch = FetchType.LAZY)
    private List<Evaluation> evaluationsAsEvaluator = new ArrayList<>();

    /** Quan hệ One-to-Many với Comment: 1 nhân viên có thể viết nhiều comment */
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    /** Quan hệ One-to-Many với TaskDelegation (fromEmployee): 1 nhân viên có thể ủy thác nhiều task */
    @OneToMany(mappedBy = "fromEmployee", fetch = FetchType.LAZY)
    private List<TaskDelegation> taskDelegationsFrom = new ArrayList<>();

    /** Quan hệ One-to-Many với TaskDelegation (toEmployee): 1 nhân viên có thể nhận nhiều task được ủy thác */
    @OneToMany(mappedBy = "toEmployee", fetch = FetchType.LAZY)
    private List<TaskDelegation> taskDelegationsTo = new ArrayList<>();

    /** Quan hệ One-to-Many với EmployeeBenefits: 1 nhân viên có thể có nhiều phúc lợi */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<EmployeeBenefits> employeeBenefits = new ArrayList<>();

}