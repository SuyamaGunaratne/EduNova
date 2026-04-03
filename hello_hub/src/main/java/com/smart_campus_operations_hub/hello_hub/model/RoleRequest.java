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
@Document(collection = "role_requests")
public class RoleRequest {

    @Id
    private String id;

    private String userId;

    private String userEmail;

    private String userName;

    private UserRole requestedRole;

    private RequestStatus status; // PENDING, APPROVED, REJECTED

    private String rejectionReason;

    private Instant createdAt;

    private Instant reviewedAt;

    private String reviewedBy; // Admin email who approved/rejected
}
