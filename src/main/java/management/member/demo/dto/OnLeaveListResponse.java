package management.member.demo.dto;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import management.member.demo.Enum.OnLeaveStatus;
import management.member.demo.Enum.OnLeaveType;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OnLeaveListResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Enumerated(EnumType.STRING)
    OnLeaveType onLeaveType;
    @Enumerated(EnumType.STRING)
    OnLeaveStatus onLeaveStatus;
    LocalDate startDate;
    LocalDate endDate;
}
