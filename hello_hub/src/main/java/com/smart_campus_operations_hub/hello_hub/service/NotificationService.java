package com.smart_campus_operations_hub.hello_hub.service;

import com.smart_campus_operations_hub.hello_hub.model.Notification;
import com.smart_campus_operations_hub.hello_hub.model.UserRole;
import com.smart_campus_operations_hub.hello_hub.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getNotificationsForAdmin() {
        return notificationRepository.findAllByRecipientRoleOrderByCreatedAtDesc(UserRole.ADMIN);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}
