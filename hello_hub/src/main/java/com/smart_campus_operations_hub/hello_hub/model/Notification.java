package com.smart_campus_operations_hub.hello_hub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String recipientId;

    private UserRole recipientRole;

    private String message;

    private String referenceId;

    private String referencePath;

    private boolean read;

    private Instant createdAt;
}
