package com.smart_campus_operations_hub.hello_hub.repository;

import com.smart_campus_operations_hub.hello_hub.model.ResourceRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRequestRepository extends MongoRepository<ResourceRequest, String> {
    List<ResourceRequest> findByRequestedBy(String requestedBy);
    List<ResourceRequest> findByTypeAndDate(String type, java.time.LocalDate date);
}
