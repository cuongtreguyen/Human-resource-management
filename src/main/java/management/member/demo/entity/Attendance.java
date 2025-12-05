package management.member.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.member.demo.enums.AttendenceStatus;
import management.member.demo.enums.EmployeeStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Quan hệ với Employee */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    /** User ID (giữ lại để tương thích với hệ thống cũ) */
    @Column(name = "user_id")
    private String userId;

    @Column(name = "fullName")
    private String fullName;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "check_in")
    private LocalTime checkIn;

    @Column(name = "check_out")
    private LocalTime checkOut;

    /** Địa chỉ văn phòng */
    @Size(max = 255)
    @Column(name = "day_off")
    private String dayOff;

    /** Địa chỉ văn phòng */
    @Size(max = 255)
    @Column(name = "late_day")
    private String lateDay;

    /** Trạng thái - Default là NOT_CHECKED_IN, chỉ chuyển sang IN_WORK khi check-in */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = true)
    private AttendenceStatus status = AttendenceStatus.NOT_CHECKED_IN;

 }


