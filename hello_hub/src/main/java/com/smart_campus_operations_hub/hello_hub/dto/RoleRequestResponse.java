package com.smart_campus_operations_hub.hello_hub.dto;

public record RoleRequestResponse(
        UserDto user,
        RoleRequestDto roleRequest,
        boolean hasApprovedRole
) {
}
