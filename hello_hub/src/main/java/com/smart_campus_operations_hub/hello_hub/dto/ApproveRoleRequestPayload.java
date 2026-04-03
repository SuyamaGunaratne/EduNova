package com.smart_campus_operations_hub.hello_hub.dto;

import jakarta.validation.constraints.NotNull;

public record ApproveRoleRequestPayload(
        @NotNull String requestId
) {
}
