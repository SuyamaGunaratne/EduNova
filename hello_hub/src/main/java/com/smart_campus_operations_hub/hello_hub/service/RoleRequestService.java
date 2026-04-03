package com.smart_campus_operations_hub.hello_hub.service;

import com.smart_campus_operations_hub.hello_hub.dto.RoleRequestDto;
import com.smart_campus_operations_hub.hello_hub.exception.ResourceNotFoundException;
import com.smart_campus_operations_hub.hello_hub.model.AppUser;
import com.smart_campus_operations_hub.hello_hub.model.RequestStatus;
import com.smart_campus_operations_hub.hello_hub.model.RoleRequest;
import com.smart_campus_operations_hub.hello_hub.model.UserRole;
import com.smart_campus_operations_hub.hello_hub.repository.RoleRequestRepository;
import com.smart_campus_operations_hub.hello_hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleRequestService {

    private final RoleRequestRepository roleRequestRepository;
    private final UserRepository userRepository;

    public RoleRequest createRoleRequest(String userEmail, UserRole requestedRole) {
        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Check if user already has a pending request
        Optional<RoleRequest> existingPending = roleRequestRepository
                .findByUserEmailAndStatus(userEmail, RequestStatus.PENDING);

        if (existingPending.isPresent()) {
            // Return existing pending request
            return existingPending.get();
        }

        RoleRequest roleRequest = RoleRequest.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getName())
                .requestedRole(requestedRole)
                .status(RequestStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        return roleRequestRepository.save(roleRequest);
    }

    public RoleRequest approveRoleRequest(String requestId, String adminEmail) {
        RoleRequest roleRequest = roleRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Role request not found: " + requestId));

        // Update user's role
        AppUser user = userRepository.findByEmail(roleRequest.getUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + roleRequest.getUserEmail()));

        user.setRole(roleRequest.getRequestedRole());
        userRepository.save(user);

        // Update role request status
        roleRequest.setStatus(RequestStatus.APPROVED);
        roleRequest.setReviewedAt(Instant.now());
        roleRequest.setReviewedBy(adminEmail);

        return roleRequestRepository.save(roleRequest);
    }

    public RoleRequest rejectRoleRequest(String requestId, String rejectionReason, String adminEmail) {
        RoleRequest roleRequest = roleRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Role request not found: " + requestId));

        roleRequest.setStatus(RequestStatus.REJECTED);
        roleRequest.setRejectionReason(rejectionReason);
        roleRequest.setReviewedAt(Instant.now());
        roleRequest.setReviewedBy(adminEmail);

        return roleRequestRepository.save(roleRequest);
    }

    public List<RoleRequest> getPendingRequests() {
        return roleRequestRepository.findByStatus(RequestStatus.PENDING);
    }

    public Optional<RoleRequest> getUserLatestRequest(String userEmail) {
        return roleRequestRepository.findTopByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public List<RoleRequest> getUserRequestHistory(String userEmail) {
        return roleRequestRepository.findByUserEmail(userEmail);
    }

    public RoleRequestDto toDto(RoleRequest roleRequest) {
        return new RoleRequestDto(
                roleRequest.getId(),
                roleRequest.getUserId(),
                roleRequest.getUserEmail(),
                roleRequest.getUserName(),
                roleRequest.getRequestedRole(),
                roleRequest.getStatus().name(),
                roleRequest.getRejectionReason(),
                roleRequest.getCreatedAt() != null ? roleRequest.getCreatedAt().toEpochMilli() : null,
                roleRequest.getReviewedAt() != null ? roleRequest.getReviewedAt().toEpochMilli() : null,
                roleRequest.getReviewedBy()
        );
    }
}
