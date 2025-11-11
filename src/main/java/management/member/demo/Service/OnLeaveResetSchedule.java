package management.member.demo.Service;

import management.member.demo.entity.Employee;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class OnLeaveResetSchedule {

    @Autowired
    EmployeeRepository employeeRepository;

    public OnLeaveResetSchedule(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Chạy mỗi ngày lúc 2 giờ sáng
    @Scheduled(cron = "0 0 2 * * *")
    public void resetLeaveDaysAnnually() {
        List<Employee> employees = employeeRepository.findAll();
        LocalDate now = LocalDate.now();

        for (Employee e : employees) {
            long yearsWorked = ChronoUnit.YEARS.between(e.getHireDate(), now);
            LocalDate resetDate = e.getHireDate().plusYears(yearsWorked);

            if (!now.isBefore(resetDate)) {
                e.setRemainingLeaveDays(12);
                employeeRepository.save(e);
            }
        }
    }
}
