package com.wedding.invitation.service;

import com.wedding.invitation.dto.*;
import com.wedding.invitation.model.*;
import com.wedding.invitation.repository.GuestInvitationRepository;
import com.wedding.invitation.util.TokenGenerator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GuestService {

    private final GuestInvitationRepository guestRepository;

    @Value("${wedding.app.base-url:}")
    private String configuredBaseUrl;

    public GuestService(GuestInvitationRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Transactional
    public GuestResponseDto createGuest(CreateGuestDto dto, HttpServletRequest request) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guest name is required");
        }

        // Generate a collision-free unique 12-char token
        String token;
        int attempts = 0;
        do {
            token = TokenGenerator.generateToken();
            attempts++;
            if (attempts > 10) {
                token = TokenGenerator.generateToken(16);
            }
        } while (guestRepository.existsByToken(token));

        GuestType type = GuestType.FAMILY;
        if (dto.getType() != null && "INDIVIDUAL".equalsIgnoreCase(dto.getType().trim())) {
            type = GuestType.INDIVIDUAL;
        }

        GuestInvitation guest = new GuestInvitation(dto.getName().trim(), type, token);

        if (dto.getAllowedEvents() != null && !dto.getAllowedEvents().isEmpty()) {
            guest.setAllowedEventsList(dto.getAllowedEvents());
        } else {
            guest.setAllowedEventsList(List.of("MEHENDI", "HALDI", "WEDDING", "RECEPTION"));
        }

        // Add family members if provided
        if (dto.getMembers() != null && !dto.getMembers().isEmpty()) {
            for (String memberName : dto.getMembers()) {
                if (memberName != null && !memberName.trim().isEmpty()) {
                    guest.addMember(new FamilyMember(memberName.trim()));
                }
            }
        } else if (type == GuestType.INDIVIDUAL) {
            // For individual guest, add the guest as single member by default
            guest.addMember(new FamilyMember(dto.getName().trim()));
        }

        GuestInvitation saved = guestRepository.save(guest);
        return mapToResponseDto(saved, request);
    }

    public GuestResponseDto getGuestById(Long id, HttpServletRequest request) {
        GuestInvitation guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guest not found with ID: " + id));
        return mapToResponseDto(guest, request);
    }

    public List<GuestResponseDto> getAllGuests(HttpServletRequest request) {
        return guestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(g -> mapToResponseDto(g, request))
                .collect(Collectors.toList());
    }

    @Transactional
    public GuestResponseDto updateGuest(Long id, UpdateGuestDto dto, HttpServletRequest request) {
        GuestInvitation guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guest not found with ID: " + id));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            guest.setName(dto.getName().trim());
        }

        if (dto.getType() != null && !dto.getType().trim().isEmpty()) {
            try {
                guest.setType(GuestType.valueOf(dto.getType().trim().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
            }
        }

        if (dto.getMembers() != null) {
            guest.clearMembers();
            for (String memberName : dto.getMembers()) {
                if (memberName != null && !memberName.trim().isEmpty()) {
                    guest.addMember(new FamilyMember(memberName.trim()));
                }
            }
        }

        if (dto.getAllowedEvents() != null) {
            guest.setAllowedEventsList(dto.getAllowedEvents());
        }

        GuestInvitation saved = guestRepository.save(guest);
        return mapToResponseDto(saved, request);
    }

    @Transactional
    public GuestResponseDto updateGuestEvents(Long id, UpdateGuestEventsDto dto, HttpServletRequest request) {
        GuestInvitation guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guest not found with ID: " + id));

        if (dto != null && dto.getAllowedEvents() != null) {
            guest.setAllowedEventsList(dto.getAllowedEvents());
        }

        GuestInvitation saved = guestRepository.save(guest);
        return mapToResponseDto(saved, request);
    }

    @Transactional
    public GuestResponseDto updateGuestStatus(Long id, String statusStr, HttpServletRequest request) {
        GuestInvitation guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guest not found with ID: " + id));

        if (statusStr == null || statusStr.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status cannot be empty (ACTIVE or INACTIVE)");
        }

        try {
            InvitationStatus status = InvitationStatus.valueOf(statusStr.trim().toUpperCase());
            guest.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: must be ACTIVE or INACTIVE");
        }

        GuestInvitation saved = guestRepository.save(guest);
        return mapToResponseDto(saved, request);
    }

    public PublicInvitationDto getPublicInvitation(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token is required");
        }

        GuestInvitation guest = guestRepository.findByToken(token.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitation not found for token: " + token));

        PublicInvitationDto dto = new PublicInvitationDto();
        dto.setName(guest.getName());
        dto.setType(guest.getType().name());
        dto.setStatus(guest.getStatus().name());
        dto.setRsvpStatus(guest.getRsvpStatus().name());
        dto.setMessage(guest.getMessage());

        List<PublicInvitationDto.PublicMemberDto> memberDtos = guest.getMembers().stream()
                .map(m -> new PublicInvitationDto.PublicMemberDto(m.getName(), m.isAttending()))
                .collect(Collectors.toList());
        dto.setMembers(memberDtos);
        dto.setAllowedEvents(guest.getAllowedEventsList());

        return dto;
    }

    @Transactional
    public Map<String, Object> submitRsvp(String token, SubmitPersonalizedRsvpDto dto) {
        if (token == null || token.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token is required");
        }

        GuestInvitation guest = guestRepository.findByToken(token.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitation not found for token: " + token));

        if (guest.getStatus() == InvitationStatus.INACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This invitation link is no longer active. Please contact the host.");
        }

        String statusStr = dto.getRsvpStatus() != null ? dto.getRsvpStatus().trim().toUpperCase() : "";
        RsvpState rsvpState;
        if ("ATTENDING".equals(statusStr) || "HADIR".equals(statusStr) || "ACCEPT".equals(statusStr)) {
            rsvpState = RsvpState.ATTENDING;
        } else if ("NOT_ATTENDING".equals(statusStr) || "TIDAK_HADIR".equals(statusStr) || "DECLINE".equals(statusStr)) {
            rsvpState = RsvpState.NOT_ATTENDING;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid RSVP status. Must be ATTENDING or NOT_ATTENDING.");
        }

        guest.setRsvpStatus(rsvpState);

        Set<String> attendingSet = new HashSet<>();
        if (dto.getAttendingMembers() != null) {
            for (String m : dto.getAttendingMembers()) {
                if (m != null) attendingSet.add(m.trim().toLowerCase());
            }
        }

        int attendingCount = 0;
        if (rsvpState == RsvpState.ATTENDING) {
            if (guest.getMembers().isEmpty()) {
                // If no pre-listed members, guest themselves is 1 attending
                attendingCount = 1;
            } else {
                for (FamilyMember m : guest.getMembers()) {
                    boolean isAttending = attendingSet.isEmpty() || attendingSet.contains(m.getName().trim().toLowerCase());
                    m.setAttending(isAttending);
                    if (isAttending) attendingCount++;
                }
                // If none specifically checked in attendingMembers, default to all attending
                if (attendingCount == 0 && attendingSet.isEmpty()) {
                    for (FamilyMember m : guest.getMembers()) {
                        m.setAttending(true);
                        attendingCount++;
                    }
                }
            }
        } else {
            // NOT_ATTENDING: mark all members as false
            for (FamilyMember m : guest.getMembers()) {
                m.setAttending(false);
            }
            attendingCount = 0;
        }

        if (dto.getMessage() != null) {
            guest.setMessage(dto.getMessage().trim());
        }

        guest.setRespondedAt(LocalDateTime.now());
        guestRepository.save(guest);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", rsvpState == RsvpState.ATTENDING
                ? "Thank you! Your RSVP has been joyfully recorded."
                : "Thank you for letting us know. You will be dearly missed!");
        response.put("name", guest.getName());
        response.put("rsvpStatus", guest.getRsvpStatus().name());
        response.put("attendingCount", attendingCount);
        response.put("respondedAt", guest.getRespondedAt().toString());

        return response;
    }

    public String buildRsvpLink(String token, HttpServletRequest request) {
        if (configuredBaseUrl != null && !configuredBaseUrl.trim().isEmpty()) {
            String base = configuredBaseUrl.trim().replaceAll("/+$", "");
            return base + "/rsvp/" + token;
        }

        if (request != null) {
            String proto = request.getHeader("X-Forwarded-Proto");
            if (proto == null || proto.isEmpty()) {
                proto = request.getScheme();
            }

            String host = request.getHeader("X-Forwarded-Host");
            if (host == null || host.isEmpty()) {
                host = request.getHeader("Host");
            }
            if (host == null || host.isEmpty()) {
                host = request.getServerName() + (request.getServerPort() == 80 || request.getServerPort() == 443 ? "" : ":" + request.getServerPort());
            }

            return proto + "://" + host + "/rsvp/" + token;
        }

        return "https://mywedding.com/rsvp/" + token;
    }

    private GuestResponseDto mapToResponseDto(GuestInvitation guest, HttpServletRequest request) {
        GuestResponseDto dto = new GuestResponseDto();
        dto.setId(guest.getId());
        dto.setName(guest.getName());
        dto.setType(guest.getType().name());
        dto.setToken(guest.getToken());
        dto.setStatus(guest.getStatus().name());
        dto.setRsvpStatus(guest.getRsvpStatus().name());
        dto.setMessage(guest.getMessage());
        dto.setRespondedAt(guest.getRespondedAt());
        dto.setCreatedAt(guest.getCreatedAt());
        dto.setRsvpLink(buildRsvpLink(guest.getToken(), request));

        List<GuestResponseDto.MemberDto> memberDtos = guest.getMembers().stream()
                .map(m -> new GuestResponseDto.MemberDto(m.getId(), m.getName(), m.isAttending()))
                .collect(Collectors.toList());
        dto.setMembers(memberDtos);
        dto.setAllowedEvents(guest.getAllowedEventsList());

        return dto;
    }
}
