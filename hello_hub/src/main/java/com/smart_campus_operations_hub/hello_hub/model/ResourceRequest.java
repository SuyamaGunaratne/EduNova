package com.smart_campus_operations_hub.hello_hub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resource_requests")
public class ResourceRequest {

    @Id
    private String id;

    private String requestedBy;

    private String requesterName;

    private String description;

    private String type;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private RequestStatus status;

    private Instant createdAt;
}
