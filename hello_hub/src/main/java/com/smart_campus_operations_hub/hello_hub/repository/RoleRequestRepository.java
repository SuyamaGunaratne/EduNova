package com.smart_campus_operations_hub.hello_hub.repository;

import com.smart_campus_operations_hub.hello_hub.model.RequestStatus;
import com.smart_campus_operations_hub.hello_hub.model.RoleRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRequestRepository extends MongoRepository<RoleRequest, String> {
    Optional<RoleRequest> findByUserEmailAndStatus(String userEmail, RequestStatus status);

    List<RoleRequest> findByStatus(RequestStatus status);

    List<RoleRequest> findByUserEmail(String userEmail);

    Optional<RoleRequest> findTopByUserEmailOrderByCreatedAtDesc(String userEmail);
}
