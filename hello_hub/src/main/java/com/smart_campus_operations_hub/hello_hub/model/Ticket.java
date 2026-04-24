package com.smart_campus_operations_hub.hello_hub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String resourceId;

    private String resourceName;

    private String reportedBy;

    private String reporterName;

    private String issue;

    private String status; // OPEN, IN_PROGRESS, RESOLVED

    private String assignedTechnicianId;

    private String assignedTechnicianName;

    private Instant createdAt;
}
