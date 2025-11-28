package management.member.demo.Service;

import management.member.demo.Mapper.NotificationMapper;
import management.member.demo.dto.*;
import management.member.demo.entity.Notification;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.repository.NotificationRepository;
import management.member.demo.validator.NotificationValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationMapper notificationMapper;

    @Autowired
    private NotificationValidator notificationValidator;

    public NotificationListResponseDTO getNotifications(Boolean read, String type) {
        List<Notification> notifications = notificationRepository.findByFilters(read, type);
        
        NotificationListResponseDTO response = new NotificationListResponseDTO();
        response.setData(notifications.stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList()));
        response.setSuccess(true);
        
        return response;
    }

    public MarkNotificationReadResponseDTO markAsRead(String id) {
        notificationValidator.validateNotificationIdString(id); // Validate trước khi parse
        Long notificationId = Long.parseLong(id);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        
        notification.setRead(true);
        notificationRepository.save(notification);
        
        MarkNotificationReadResponseDTO response = new MarkNotificationReadResponseDTO();
        response.setId(id);
        response.setSuccess(true);
        response.setMessage("Notification marked as read");
        
        return response;
    }

    public MarkAllReadResponseDTO markAllAsRead() {
        List<Notification> unreadNotifications = notificationRepository.findByRead(false);
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
        
        MarkAllReadResponseDTO response = new MarkAllReadResponseDTO();
        response.setSuccess(true);
        response.setMessage("All notifications marked as read (" + unreadNotifications.size() + " notifications)");
        
        return response;
    }

}

