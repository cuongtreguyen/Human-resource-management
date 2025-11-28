package management.member.demo.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import management.member.demo.Mapper.TaskDelegationMapper;
import management.member.demo.dto.*;
import management.member.demo.entity.Employee;
import management.member.demo.entity.TaskDelegation;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.repository.EmployeeRepository;
import management.member.demo.repository.TaskDelegationRepository;
import management.member.demo.validator.TaskDelegationValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskDelegationService {

    @Autowired
    private TaskDelegationRepository delegationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskDelegationMapper taskDelegationMapper;

    @Autowired
    private TaskDelegationValidator taskDelegationValidator;

    public CreateDelegationResponseDTO createDelegation(CreateDelegationRequestDTO request) {
        taskDelegationValidator.validateCreateDelegationRequest(request); // Validate request
        Long fromEmployeeId = Long.parseLong(request.getFromEmployeeId()); // Validator đã đảm bảo format hợp lệ
        Long toEmployeeId = Long.parseLong(request.getToEmployeeId()); // Validator đã đảm bảo format hợp lệ

        Employee fromEmployee = employeeRepository.findById(fromEmployeeId)
                .orElseThrow(() -> new ResourceNotFoundException("From employee not found with id: " + request.getFromEmployeeId()));
        Employee toEmployee = employeeRepository.findById(toEmployeeId)
                .orElseThrow(() -> new ResourceNotFoundException("To employee not found with id: " + request.getToEmployeeId()));

        TaskDelegation delegation = new TaskDelegation();
        delegation.setFromEmployee(fromEmployee);
        delegation.setToEmployee(toEmployee);
        
        // Convert task IDs list to JSON string
        try {
            String taskIdsJson = objectMapper.writeValueAsString(request.getTaskIds());
            delegation.setTaskIds(taskIdsJson);
        } catch (Exception e) {
            throw ErrorCode.FILE_SERIALIZATION_ERROR.toException("Không thể serialize danh sách task IDs: " + e.getMessage());
        }
        
        delegation.setStartDate(request.getStartDate());
        delegation.setEndDate(request.getEndDate());
        delegation.setReason(request.getReason());
        delegation.setStatus("pending");
        delegation.setCreatedAt(LocalDate.now());

        TaskDelegation savedDelegation = delegationRepository.save(delegation);

        CreateDelegationResponseDTO response = new CreateDelegationResponseDTO();
        response.setId(String.valueOf(savedDelegation.getId()));
        response.setSuccess(true);
        response.setMessage("Delegation created successfully");

        return response;
    }

    public DelegationListResponseDTO getDelegations(String employeeId, String status) {
        Long empId = employeeId != null ? Long.parseLong(employeeId) : null;
        List<TaskDelegation> delegations = delegationRepository.findByFilters(empId, status);
        
        DelegationListResponseDTO response = new DelegationListResponseDTO();
        response.setData(delegations.stream()
                .map(taskDelegationMapper::toDelegationListItemDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public UpdateDelegationStatusResponseDTO approveDelegation(String id) {
        Long delegationId = Long.parseLong(id);
        TaskDelegation delegation = delegationRepository.findById(delegationId)
                .orElseThrow(() -> new ResourceNotFoundException("Delegation not found with id: " + id));

        delegation.setStatus("approved");
        delegationRepository.save(delegation);

        UpdateDelegationStatusResponseDTO response = new UpdateDelegationStatusResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Delegation approved successfully");
        response.setStatus("approved");

        return response;
    }

    public UpdateDelegationStatusResponseDTO rejectDelegation(String id, RejectDelegationRequestDTO request) {
        taskDelegationValidator.validateDelegationIdString(id); // Validate trước khi parse
        Long delegationId = Long.parseLong(id);
        TaskDelegation delegation = delegationRepository.findById(delegationId)
                .orElseThrow(() -> new ResourceNotFoundException("Delegation not found with id: " + id));

        delegation.setStatus("rejected");
        if (request != null && request.getReason() != null) {
            delegation.setReason(request.getReason());
        }
        delegationRepository.save(delegation);

        UpdateDelegationStatusResponseDTO response = new UpdateDelegationStatusResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Delegation rejected");
        response.setStatus("rejected");

        return response;
    }
}

