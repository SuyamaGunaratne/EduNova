package com.smart_campus_operations_hub.hello_hub.dto;

import jakarta.validation.constraints.NotNull;

public record ReviewRoleRequestDto(
        @NotNull String requestId,
        @NotNull String action, // "APPROVE" or "REJECT"
        String rejectionReason // Only required if action is REJECT
) {
}
