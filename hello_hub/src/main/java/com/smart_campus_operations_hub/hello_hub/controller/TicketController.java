package com.smart_campus_operations_hub.hello_hub.controller;

import com.smart_campus_operations_hub.hello_hub.model.AppUser;
import com.smart_campus_operations_hub.hello_hub.model.Ticket;
import com.smart_campus_operations_hub.hello_hub.repository.TicketRepository;
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
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketRepository ticketRepository;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(Authentication authentication, @RequestBody Ticket ticket) {
        AppUser user = userService.getByEmail(authentication.getName());
        ticket.setReportedBy(user.getId());
        ticket.setReporterName(user.getName());
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(Instant.now());
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Authentication authentication) {
        AppUser user = userService.getByEmail(authentication.getName());
        return ResponseEntity.ok(ticketRepository.findByReportedBy(user.getId()));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<Ticket>> getAssignedTickets(Authentication authentication) {
        AppUser user = userService.getByEmail(authentication.getName());
        return ResponseEntity.ok(ticketRepository.findByAssignedTechnicianId(user.getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Ticket> updateStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(request.get("status"));
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> assignTicket(@PathVariable String id, @RequestBody Map<String, String> request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setAssignedTechnicianId(request.get("technicianId"));
        ticket.setAssignedTechnicianName(request.get("technicianName"));
        ticket.setStatus("IN_PROGRESS");
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }
}
