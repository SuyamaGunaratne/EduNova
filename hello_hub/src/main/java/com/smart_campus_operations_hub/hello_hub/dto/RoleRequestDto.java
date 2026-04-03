package com.smart_campus_operations_hub.hello_hub.dto;

import com.smart_campus_operations_hub.hello_hub.model.UserRole;
import jakarta.validation.constraints.NotNull;

public record RoleRequestDto(
        String id,
        String userId,
        String userEmail,
        String userName,
        @NotNull UserRole requestedRole,
        String status,
        String rejectionReason,
        Long createdAt,
        Long reviewedAt,
        String reviewedBy
) {
}
