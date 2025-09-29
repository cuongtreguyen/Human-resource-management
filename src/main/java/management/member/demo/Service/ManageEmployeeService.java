package management.member.demo.Service;

import management.member.demo.dto.EmployeeRequest;
import management.member.demo.dto.EmployeeResponse;
import management.member.demo.entity.Employee;
import management.member.demo.repository.ManageEmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import management.member.demo.exception.ResourceNotFoundException;
import management.member.demo.exception.BusinessException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManageEmployeeService {

	private final ManageEmployeeRepository repository;

	@Autowired
	public ManageEmployeeService(ManageEmployeeRepository repository) {
		this.repository = repository;
	}

    @Autowired
    private ModelMapper mapper;

    public EmployeeResponse create(EmployeeRequest request) {
        if (request.getEmail() != null && repository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMPLOYEE_EMAIL_EXISTS", "Employee email already exists");
        }
        if (request.getEmployeeId() != null && repository.existsByEmployeeId(request.getEmployeeId())) {
            throw new BusinessException("EMPLOYEE_CODE_EXISTS", "Employee code already exists");
        }
        Employee e = mapper.map(request, Employee.class);
        e = repository.save(e);
        return mapper.map(e, EmployeeResponse.class);
    }

    public List<EmployeeResponse> informationEmployee() {
        return repository.findAll().stream()
                .map(e -> mapper.map(e, EmployeeResponse.class))
                .collect(Collectors.toList());
    }

    public EmployeeResponse findEmployeeById(Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapper.map(employee, EmployeeResponse.class);
    }
}
