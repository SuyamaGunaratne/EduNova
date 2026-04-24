package com.smart_campus_operations_hub.hello_hub.repository;

import com.smart_campus_operations_hub.hello_hub.model.Notification;
import com.smart_campus_operations_hub.hello_hub.model.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findAllByRecipientIdOrderByCreatedAtDesc(String recipientId);
    List<Notification> findAllByRecipientRoleOrderByCreatedAtDesc(UserRole recipientRole);
    List<Notification> findAllByRecipientIdOrRecipientRoleOrderByCreatedAtDesc(String recipientId, UserRole recipientRole);
}
