package management.member.demo.service;

import management.member.demo.dto.*;
import management.member.demo.entity.Notification;
import management.member.demo.exception.model.ErrorCode;
import management.member.demo.exception.specifiic.ResourceNotFoundException;
import management.member.demo.mapper.NotificationMapper;
import management.member.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationMapper notificationMapper;

    public NotificationListResponseDTO getNotifications(Boolean read, String type) {
        List<Notification> notifications = notificationRepository.findAll();

        // Apply filters
        if (read != null) {
            notifications = notifications.stream()
                    .filter(n -> n.getRead() == read)
                    .collect(Collectors.toList());
        }
        if (type != null && !type.isEmpty()) {
            notifications = notifications.stream()
                    .filter(n -> type.equals(n.getType()))
                    .collect(Collectors.toList());
        }

        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList());

        NotificationListResponseDTO response = new NotificationListResponseDTO();
        response.setData(notificationDTOs);
        response.setSuccess(true);

        return response;
    }

    public MarkNotificationReadResponseDTO markAsRead(String id) {
        Long notificationId = Long.parseLong(id);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.NOTIFICATION_NOT_FOUND.getMessage()));

        notification.setRead(true);
        notificationRepository.save(notification);

        MarkNotificationReadResponseDTO response = new MarkNotificationReadResponseDTO();
        response.setId(id);
        response.setRead(true);
        response.setSuccess(true);
        response.setMessage("Notification marked as read");

        return response;
    }

    public MarkAllReadResponseDTO markAllAsRead() {
        List<Notification> notifications = notificationRepository.findAll();
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);

        MarkAllReadResponseDTO response = new MarkAllReadResponseDTO();
        response.setSuccess(true);
        response.setMessage("All notifications marked as read");

        return response;
    }
}

