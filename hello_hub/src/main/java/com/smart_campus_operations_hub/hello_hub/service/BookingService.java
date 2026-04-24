package com.smart_campus_operations_hub.hello_hub.service;

import com.smart_campus_operations_hub.hello_hub.model.Booking;
import com.smart_campus_operations_hub.hello_hub.model.BookingStatus;
import com.smart_campus_operations_hub.hello_hub.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final com.smart_campus_operations_hub.hello_hub.repository.ResourceRepository resourceRepository;

    public Booking createBooking(Booking booking) {
        // 1. Check if End Time is after Start Time
        if (booking.getEndTime().isBefore(booking.getStartTime()) || booking.getEndTime().equals(booking.getStartTime())) {
            throw new RuntimeException("Invalid time slot: End time must be after start time.");
        }

        // 2. Check Resource Status
        com.smart_campus_operations_hub.hello_hub.model.Resource resource = resourceRepository.findById(booking.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (resource.getStatus() == com.smart_campus_operations_hub.hello_hub.model.ResourceStatus.BROKEN) {
            throw new RuntimeException("Resource not available");
        }

        // 3. Conflict checking logic (Only check ACTIVE bookings: PENDING or APPROVED)
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDateAndStatusIn(
                booking.getResourceId(),
                booking.getDate(),
                Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        for (Booking existing : existingBookings) {
            LocalTime newStart = booking.getStartTime();
            LocalTime newEnd = booking.getEndTime();
            LocalTime existingStart = existing.getStartTime();
            LocalTime existingEnd = existing.getEndTime();

            // CORE LOGIC: NewStart < ExistingEnd AND NewEnd > ExistingStart
            if (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) {
                throw new RuntimeException("Time slot has already booked");
            }
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking updateBookingStatus(String bookingId, BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        if (reason != null) {
            booking.setRejectionReason(reason);
        }
        return bookingRepository.save(booking);
    }

    public void cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}
