package com.smart_campus_operations_hub.hello_hub.dto;

import jakarta.validation.constraints.NotNull;

public record RejectRoleRequestPayload(
        @NotNull String requestId,
        String rejectionReason
) {
}
