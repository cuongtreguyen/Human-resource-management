package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.TaskDelegation;
import management.member.demo.entity.Employee;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.TaskDelegationMapper;
import management.member.demo.repository.TaskDelegationRepository;
import management.member.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskDelegationService {

    @Autowired
    private TaskDelegationRepository delegationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TaskDelegationMapper delegationMapper;

    public CreateDelegationResponseDTO createDelegation(CreateDelegationRequestDTO request) {
        Long fromEmployeeId = Long.parseLong(request.getFromEmployeeId());
        Long toEmployeeId = Long.parseLong(request.getToEmployeeId());

        Employee fromEmployee = employeeRepository.findById(fromEmployeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + fromEmployeeId));
        Employee toEmployee = employeeRepository.findById(toEmployeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EMPLOYEE_NOT_FOUND.getMessage() + " với ID: " + toEmployeeId));

        TaskDelegation delegation = new TaskDelegation();
        delegation.setFromEmployee(fromEmployee);
        delegation.setToEmployee(toEmployee);
        delegation.setTaskIds(String.join(",", request.getTaskIds()));
        delegation.setStartDate(request.getStartDate());
        delegation.setEndDate(request.getEndDate());
        delegation.setReason(request.getReason());
        delegation.setStatus("pending");
        delegation.setCreatedAt(LocalDate.now());

        TaskDelegation saved = delegationRepository.save(delegation);

        CreateDelegationResponseDTO response = new CreateDelegationResponseDTO();
        response.setId(String.valueOf(saved.getId()));
        response.setFromEmployeeId(request.getFromEmployeeId());
        response.setToEmployeeId(request.getToEmployeeId());
        response.setStatus(saved.getStatus() != null ? saved.getStatus() : "pending");
        response.setSuccess(true);
        response.setMessage("Yêu cầu ủy quyền công việc đã được gửi");

        return response;
    }

    public DelegationListResponseDTO getDelegations(String employeeId, String status) {
        Long empId = employeeId != null ? Long.parseLong(employeeId) : null;
        List<TaskDelegation> delegations = delegationRepository.findByFilters(empId, status);

        List<DelegationListItemDTO> delegationDTOs = delegations.stream()
                .map(delegationMapper::toDelegationListItemDTO)
                .collect(Collectors.toList());

        DelegationListResponseDTO response = new DelegationListResponseDTO();
        response.setData(delegationDTOs);
        response.setSuccess(true);

        return response;
    }

    public UpdateDelegationStatusResponseDTO approveDelegation(String id) {
        Long delegationId = Long.parseLong(id);
        TaskDelegation delegation = delegationRepository.findById(delegationId)
                .orElseThrow(() -> new ResourceNotFoundException("Delegation not found with id: " + id));

        delegation.setStatus("approved");
        TaskDelegation updated = delegationRepository.save(delegation);

        UpdateDelegationStatusResponseDTO response = new UpdateDelegationStatusResponseDTO();
        response.setId(id);
        response.setStatus(updated.getStatus());
        response.setSuccess(true);
        response.setMessage("Ủy quyền đã được phê duyệt");

        return response;
    }

    public UpdateDelegationStatusResponseDTO rejectDelegation(String id, RejectDelegationRequestDTO request) {
        Long delegationId = Long.parseLong(id);
        TaskDelegation delegation = delegationRepository.findById(delegationId)
                .orElseThrow(() -> new ResourceNotFoundException("Delegation not found with id: " + id));

        delegation.setStatus("rejected");
        if (request != null && request.getReason() != null) {
            delegation.setReason(request.getReason());
        }
        TaskDelegation updated = delegationRepository.save(delegation);

        UpdateDelegationStatusResponseDTO response = new UpdateDelegationStatusResponseDTO();
        response.setId(id);
        response.setStatus(updated.getStatus());
        response.setSuccess(true);
        response.setMessage("Ủy quyền đã bị từ chối");

        return response;
    }
}

