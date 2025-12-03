package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.enums.EmployeeStatus;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.EmployeeMapper;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    public CreateEmployeeResponseDTO createEmployee(AddEmployeeRequest request) {
        // Check if email already exists
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        Employee employee = new Employee();
        employee.setFullName(request.getName());
        employee.setFirstName(request.getName().split(" ")[0]);
        employee.setLastName(request.getName().substring(request.getName().indexOf(" ") + 1));
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setPosition(request.getPosition());
        employee.setDepartment(request.getDepartment());
        employee.setHireDate(request.getHireDate());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setGender(request.getGender());
        employee.setBaseSalary(request.getSalary());
        employee.setStatus(EmployeeStatus.ACTIVE);

        // Generate employee code if not provided
        if (request.getEmployeeCode() == null || request.getEmployeeCode().isEmpty()) {
            employee.setEmployeeCode("EMP" + System.currentTimeMillis());
        } else {
            employee.setEmployeeCode(request.getEmployeeCode());
        }

        Employee saved = employeeRepository.save(employee);

        CreateEmployeeResponseDTO response = new CreateEmployeeResponseDTO();
        response.setData(new CreateEmployeeResponseDTO.EmployeeData());
        response.getData().setId(saved.getEmployeeId() != null ? saved.getEmployeeId() : String.valueOf(saved.getId()));
        response.getData().setName(saved.getFullName());
        response.getData().setStatus(saved.getStatus().name().toLowerCase());
        response.setSuccess(true);
        response.setMessage("Employee created successfully");

        return response;
    }

    public EmployeeListResponse getEmployeesWithFilters(String search, String department, String position, String status) {
        List<Employee> employees;

        EmployeeStatus statusEnum = null;
        if (status != null && !status.isEmpty()) {
            try {
                statusEnum = EmployeeStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore filter
            }
        }

        if (search != null && !search.isEmpty()) {
            if (department != null && position != null && statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartmentAndPositionAndStatus(search, department, position, statusEnum);
            } else if (department != null && statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartmentAndStatus(search, department, statusEnum);
            } else if (position != null && statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndPositionAndStatus(search, position, statusEnum);
            } else if (department != null && position != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartmentAndPosition(search, department, position);
            } else if (department != null) {
                employees = employeeRepository.searchByNameOrEmailAndDepartment(search, department);
            } else if (position != null) {
                employees = employeeRepository.searchByNameOrEmailAndPosition(search, position);
            } else if (statusEnum != null) {
                employees = employeeRepository.searchByNameOrEmailAndStatus(search, statusEnum);
            } else {
                employees = employeeRepository.searchByNameOrEmail(search);
            }
        } else {
            if (department != null && position != null && statusEnum != null) {
                employees = employeeRepository.findByDepartmentAndPositionAndStatus(department, position, statusEnum);
            } else if (department != null && statusEnum != null) {
                employees = employeeRepository.findByDepartmentAndStatus(department, statusEnum);
            } else if (position != null && statusEnum != null) {
                employees = employeeRepository.findByPositionAndStatus(position, statusEnum);
            } else if (department != null && position != null) {
                employees = employeeRepository.findByDepartmentAndPosition(department, position);
            } else if (department != null) {
                employees = employeeRepository.findByDepartment(department);
            } else if (position != null) {
                employees = employeeRepository.findByPosition(position);
            } else if (statusEnum != null) {
                employees = employeeRepository.findByStatus(statusEnum);
            } else {
                employees = employeeRepository.findAll();
            }
        }

        List<EmployeeListItemDTO> employeeDTOs = employees.stream()
                .map(employeeMapper::toListItemDTO)
                .collect(Collectors.toList());

        EmployeeListResponse response = new EmployeeListResponse();
        response.setData(employeeDTOs);
        response.setSuccess(true);
        response.setTotal(employeeDTOs.size());

        return response;
    }

    public Long getTotalEmployees() {
        return employeeRepository.count();
    }

    public Long getActiveEmployeesCount() {
        return employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
    }

    public EmployeeDetailDTO getEmployeeDetailById(String id) {
        Employee employee = findEmployeeById(id);
        return employeeMapper.toDetailDTO(employee);
    }

    public UpdateEmployeeResponseDTO updateEmployeeById(String id, UpdateEmployeeRequest request) {
        Employee employee = findEmployeeById(id);

        if (request.getName() != null) {
            employee.setFullName(request.getName());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getPosition() != null) {
            employee.setPosition(request.getPosition());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getEmail() != null && !request.getEmail().equals(employee.getEmail())) {
            if (employeeRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists: " + request.getEmail());
            }
            employee.setEmail(request.getEmail());
        }

        Employee updated = employeeRepository.save(employee);

        UpdateEmployeeResponseDTO response = new UpdateEmployeeResponseDTO();
        response.setData(new UpdateEmployeeResponseDTO.EmployeeData());
        response.getData().setId(updated.getEmployeeId() != null ? updated.getEmployeeId() : String.valueOf(updated.getId()));
        response.getData().setName(updated.getFullName());
        response.setSuccess(true);
        response.setMessage("Employee updated successfully");

        return response;
    }

    public ProfileResponse getProfile(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id));
        return employeeMapper.toProfileResponse(employee);
    }

    public ProfileResponse updateProfile(Long id, ProfileUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id));

        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        // TODO: Add personalEmail field to UpdateEmployeeRequest if needed
        // if (request.getPersonalEmail() != null) {
        //     employee.setPersonalEmail(request.getPersonalEmail());
        // }
        if (request.getAddress() != null) {
            employee.setAddress(request.getAddress());
        }

        Employee updated = employeeRepository.save(employee);
        return employeeMapper.toProfileResponse(updated);
    }

    public DeleteEmployeeResponseDTO deleteEmployeeById(String id) {
        Employee employee = findEmployeeById(id);
        employeeRepository.delete(employee);

        DeleteEmployeeResponseDTO response = new DeleteEmployeeResponseDTO();
        response.setId(employee.getEmployeeId() != null ? employee.getEmployeeId() : String.valueOf(employee.getId()));
        response.setSuccess(true);
        response.setMessage("Employee deleted successfully");

        return response;
    }

    public ExportResponseDTO exportEmployees(String format, String search, String department, String status) {
        // Get filtered employees
        EmployeeListResponse employeesResponse = getEmployeesWithFilters(search, department, null, status);

        // Generate filename
        String filename = "employees_" + java.time.LocalDate.now() + "." + (format != null ? format : "xlsx");

        ExportResponseDTO response = new ExportResponseDTO();
        response.setUrl("/exports/" + filename);
        response.setFilename(filename);
        response.setSuccess(true);
        response.setMessage("Export completed successfully");

        return response;
    }

    private Employee findEmployeeById(String id) {
        // Try to parse as Long
        try {
            Long longId = Long.parseLong(id);
            Optional<Employee> employee = employeeRepository.findById(longId);
            if (employee.isPresent()) {
                return employee.get();
            }
        } catch (NumberFormatException e) {
            // Not a Long, try as employeeId or employeeCode
        }

        // Try as employeeId
        Optional<Employee> employee = employeeRepository.findByEmployeeId(id);
        if (employee.isPresent()) {
            return employee.get();
        }

        // Try as employeeCode
        employee = employeeRepository.findByEmployeeCode(id);
        if (employee.isPresent()) {
            return employee.get();
        }

        throw new ResourceNotFoundException(
                ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + id);
    }

    public java.util.Map<String, String> seniority(String employeeID) {
        Employee employee = employeeRepository.findByEmployeeId(employeeID)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + employeeID));

        java.time.LocalDate hireDate = employee.getHireDate();

        if (hireDate == null) {
            throw new IllegalArgumentException("Hire date is null");
        } else if (hireDate.isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Hire date is in the future");
        }

        java.time.LocalDate currentDate = java.time.LocalDate.now();
        java.time.Period period = java.time.Period.between(hireDate, currentDate);

        int years = period.getYears();
        int months = period.getMonths();

        String seniorityString = "";

        if (years > 0) {
            seniorityString += years + " năm";
        }
        if (months > 0) {
            if (years > 0) {
                seniorityString += " ";
            }
            seniorityString += months + " tháng";
        }

        if (seniorityString.isEmpty()) {
            seniorityString = "Dưới 1 tháng";
        }

        java.util.Map<String, String> responseBody = new java.util.HashMap<>();
        responseBody.put("seniority", seniorityString);

        return responseBody;
    }
}

