package com.smart_campus_operations_hub.hello_hub.controller;

import com.smart_campus_operations_hub.hello_hub.dto.RoleRequestDto;
import com.smart_campus_operations_hub.hello_hub.dto.RoleRequestResponse;
import com.smart_campus_operations_hub.hello_hub.dto.RoleSelectionRequest;
import com.smart_campus_operations_hub.hello_hub.dto.UserDto;
import com.smart_campus_operations_hub.hello_hub.model.AppUser;
import com.smart_campus_operations_hub.hello_hub.model.RoleRequest;
import com.smart_campus_operations_hub.hello_hub.service.JwtService;
import com.smart_campus_operations_hub.hello_hub.service.RoleRequestService;
import com.smart_campus_operations_hub.hello_hub.service.UserMapper;
import com.smart_campus_operations_hub.hello_hub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final RoleRequestService roleRequestService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(Authentication authentication) {
        AppUser user = userService.getByEmail(authentication.getName());
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PostMapping("/select-role")
    public ResponseEntity<?> selectRole(Authentication authentication,
                                        @Valid @RequestBody RoleSelectionRequest request) {
        String userEmail = authentication.getName();
        AppUser user = userService.getByEmail(userEmail);

        // Create a role request instead of directly assigning
        RoleRequest roleRequest = roleRequestService.createRoleRequest(userEmail, request.role());

        // Return response with role request status
        return ResponseEntity.ok(new RoleRequestResponse(
                userMapper.toDto(user),
                roleRequestService.toDto(roleRequest),
                user.getRole() != null // Has approved role?
        ));
    }

    @GetMapping("/role-request-status")
    public ResponseEntity<RoleRequestDto> getRoleRequestStatus(Authentication authentication) {
        String userEmail = authentication.getName();
        Optional<RoleRequest> latestRequest = roleRequestService.getUserLatestRequest(userEmail);
        
        if (latestRequest.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(roleRequestService.toDto(latestRequest.get()));
    }

    @PostMapping("/role-request/approve")
    public ResponseEntity<RoleRequestDto> approveRoleRequest(
            Authentication authentication,
            @RequestBody Map<String, String> request) {
        String requestId = request.get("requestId");

        RoleRequest approvedRequest = roleRequestService.approveRoleRequest(
                requestId,
                authentication.getName()
        );

        return ResponseEntity.ok(roleRequestService.toDto(approvedRequest));
    }

    @PostMapping("/role-request/reject")
    public ResponseEntity<RoleRequestDto> rejectRoleRequest(
            Authentication authentication,
            @RequestBody Map<String, String> request) {
        String requestId = request.get("requestId");
        String rejectionReason = request.get("rejectionReason");

        RoleRequest rejectedRequest = roleRequestService.rejectRoleRequest(
                requestId,
                rejectionReason,
                authentication.getName()
        );

        return ResponseEntity.ok(roleRequestService.toDto(rejectedRequest));
    }

    @GetMapping("/role-requests/pending")
    public ResponseEntity<List<RoleRequestDto>> getPendingRoleRequests(Authentication authentication) {
        // This should be protected to admin only (handle via SecurityConfig)
        List<RoleRequest> pendingRequests = roleRequestService.getPendingRequests();
        List<RoleRequestDto> dtos = pendingRequests.stream()
                .map(roleRequestService::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/check-approval")
    public ResponseEntity<Map<String, Object>> checkApproval(Authentication authentication) {
        String userEmail = authentication.getName();
        AppUser user = userService.getByEmail(userEmail);
        Optional<RoleRequest> latestRequest = roleRequestService.getUserLatestRequest(userEmail);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("user", userMapper.toDto(user));
        response.put("hasApprovedRole", user.getRole() != null);
        
        if (latestRequest.isPresent()) {
            response.put("roleRequest", roleRequestService.toDto(latestRequest.get()));
        }

        return ResponseEntity.ok(response);
    }
}
