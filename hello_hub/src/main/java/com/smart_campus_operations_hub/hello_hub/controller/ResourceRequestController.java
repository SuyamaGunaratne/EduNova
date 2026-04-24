package com.smart_campus_operations_hub.hello_hub.controller;

import com.smart_campus_operations_hub.hello_hub.model.AppUser;
import com.smart_campus_operations_hub.hello_hub.model.Notification;
import com.smart_campus_operations_hub.hello_hub.model.RequestStatus;
import com.smart_campus_operations_hub.hello_hub.model.ResourceRequest;
import com.smart_campus_operations_hub.hello_hub.model.UserRole;
import com.smart_campus_operations_hub.hello_hub.repository.ResourceRequestRepository;
import com.smart_campus_operations_hub.hello_hub.service.NotificationService;
import com.smart_campus_operations_hub.hello_hub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resource-requests")
@RequiredArgsConstructor
public class ResourceRequestController {

    private final ResourceRequestRepository resourceRequestRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<ResourceRequest> createRequest(Authentication authentication, @RequestBody ResourceRequest request) {
        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().equals(request.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        // Check for overlapping requests of the same type on the same date
        List<ResourceRequest> existing = resourceRequestRepository.findByTypeAndDate(request.getType(), request.getDate());
        for (ResourceRequest other : existing) {
            if (other.getStatus() == RequestStatus.REJECTED) continue;
            
            // CORE LOGIC: NewStart < ExistingEnd AND NewEnd > ExistingStart
            if (request.getStartTime().isBefore(other.getEndTime()) && request.getEndTime().isAfter(other.getStartTime())) {
                throw new RuntimeException("TIME SLOT HAS ALREADY BOOKED");
            }
        }

        AppUser user = userService.getByEmail(authentication.getName());
        request.setRequestedBy(user.getId());
        request.setRequesterName(user.getName());
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(Instant.now());

        ResourceRequest savedRequest = resourceRequestRepository.save(request);

        notificationService.createNotification(Notification.builder()
                .recipientRole(UserRole.ADMIN)
                .message(user.getName() + " submitted a new equipment request: " + request.getType() + " on " + request.getDate() + " at " + request.getStartTime() + " - " + request.getEndTime())
                .referenceId(savedRequest.getId())
                .referencePath("/admin/notifications")
                .read(false)
                .createdAt(Instant.now())
                .build());

        return ResponseEntity.ok(savedRequest);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResourceRequest>> getAllRequests() {
        return ResponseEntity.ok(resourceRequestRepository.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ResourceRequest>> getMyRequests(Authentication authentication) {
        AppUser user = userService.getByEmail(authentication.getName());
        return ResponseEntity.ok(resourceRequestRepository.findByRequestedBy(user.getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceRequest> updateStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        ResourceRequest resourceRequest = resourceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        RequestStatus status = RequestStatus.valueOf(request.get("status"));
        resourceRequest.setStatus(status);

        ResourceRequest updatedRequest = resourceRequestRepository.save(resourceRequest);

        AppUser requester = userService.getById(updatedRequest.getRequestedBy());
        String rolePath = requester.getRole() != null ? requester.getRole().toString().toLowerCase() : "student";
        String recipientPath = "/" + rolePath + "/notifications";
        String statusMessage = status == RequestStatus.APPROVED ? "approved" : "rejected";
        String extra = status == RequestStatus.REJECTED ? " Please check your request details or contact the administrator." : "";

        notificationService.createNotification(Notification.builder()
                .recipientId(updatedRequest.getRequestedBy())
                .message("Your equipment request for " + updatedRequest.getType() + " on " + updatedRequest.getDate() + " has been " + statusMessage + "." + extra)
                .referenceId(updatedRequest.getId())
                .referencePath(recipientPath)
                .read(false)
                .createdAt(Instant.now())
                .build());

        return ResponseEntity.ok(updatedRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(Authentication authentication, @PathVariable String id) {
        AppUser user = userService.getByEmail(authentication.getName());
        ResourceRequest resourceRequest = resourceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!resourceRequest.getRequestedBy().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this request");
        }
        
        resourceRequestRepository.delete(resourceRequest);
        return ResponseEntity.noContent().build();
    }
}
