package com.smart_campus_operations_hub.hello_hub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String userId;

    private String userName;

    private String resourceId;

    private String resourceName;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private BookingStatus status;

    private String purpose;

    private Integer attendees;

    private String rejectionReason;
}
