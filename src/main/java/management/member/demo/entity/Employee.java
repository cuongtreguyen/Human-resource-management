package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

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

	/** Họ và tên đầy đủ */
	@NotBlank
	@Size(max = 150)
	private String fullName;

	/** Ảnh đại diện (URL) */
	@Size(max = 255)
	private String profilePicture;

	/** Email công việc */
	@Email
	@Size(max = 120)
	@Column(unique = true)
	private String email;

	/** Số điện thoại */
	@Size(max = 30)
	private String phoneNumber;

	/** Địa chỉ */
	@Size(max = 255)
	private String address;

	/** Ngày bắt đầu làm việc */
	private LocalDate startDate;

	/** Mã nhân viên nội bộ */
	@Size(max = 50)
	@Column(name = "employee_code", unique = true)
	private String employeeId;

	/** Phòng ban */
	@Size(max = 100)
	private String department;

	/** Chức vụ */
	@Size(max = 100)
	private String position;

	/** Mức lương hiện tại */
	@Column(precision = 19, scale = 2)
	private BigDecimal salary;

	/** Kỹ năng (danh sách phân tách bằng dấu phẩy) */
	@Size(max = 1000)
	@Column(name = "skills")
	private String skill;

	/** Chứng chỉ (danh sách phân tách bằng dấu phẩy) */
	@Size(max = 1000)
	@Column(name = "certificates")
	private String certificate;

	/** Trạng thái làm việc (ACTIVE/INACTIVE/ON_LEAVE...) */
	@Size(max = 50)
	@Column(name = "employment_status")
	private String status;
}
