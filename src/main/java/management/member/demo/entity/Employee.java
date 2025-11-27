package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import management.member.demo.Enum.EmployeeStatus;

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

	/** Địa chỉ */
	@Size(max = 255)
	private String address;

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

	/** Mã nhân viên */
	@NotBlank
	@Size(max = 50)
	@Column(name = "employee_code", unique = true)
	private String employeeCode;

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

	private int remainingLeaveDays = 12;
}
