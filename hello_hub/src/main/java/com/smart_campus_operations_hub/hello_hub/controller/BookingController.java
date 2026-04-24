package com.smart_campus_operations_hub.hello_hub.controller;

import com.smart_campus_operations_hub.hello_hub.model.AppUser;
import com.smart_campus_operations_hub.hello_hub.model.Booking;
import com.smart_campus_operations_hub.hello_hub.model.BookingStatus;
import com.smart_campus_operations_hub.hello_hub.service.BookingService;
import com.smart_campus_operations_hub.hello_hub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(Authentication authentication, @RequestBody Booking booking) {
        AppUser user = userService.getByEmail(authentication.getName());
        booking.setUserId(user.getId());
        booking.setUserName(user.getName());
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        AppUser user = userService.getByEmail(authentication.getName());
        return ResponseEntity.ok(bookingService.getMyBookings(user.getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        BookingStatus status = BookingStatus.valueOf(request.get("status"));
        String reason = request.get("reason");
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(Authentication authentication, @PathVariable String id) {
        AppUser user = userService.getByEmail(authentication.getName());
        bookingService.cancelBooking(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
