package com.wedding.didi.repository;

import com.wedding.didi.model.InvitedParty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvitedPartyRepository extends JpaRepository<InvitedParty, Long> {

    Optional<InvitedParty> findByPrimaryEmailIgnoreCase(String primaryEmail);

    Optional<InvitedParty> findByInvitationCodeIgnoreCase(String invitationCode);

    Optional<InvitedParty> findByTokenHash(String tokenHash);

    Optional<InvitedParty> findByAuthToken(String authToken);

    Optional<InvitedParty> findByPassSerialIgnoreCase(String passSerial);

    List<InvitedParty> findAllByOrderByCreatedAtDesc();

    List<InvitedParty> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT COALESCE(SUM(p.allowedPartySize), 0) FROM InvitedParty p")
    long sumTotalAllowedSeats();

    @Query("SELECT COALESCE(SUM(p.confirmedHeadcount), 0) FROM InvitedParty p WHERE p.rsvpStatus = 'ATTENDING'")
    long sumConfirmedHeadcount();

    long countByRsvpStatus(String rsvpStatus);

    long countByStatus(String status);

    /**
     * Atomically claims an invitation pass for first-time registration.
     * Guaranteed atomic at DB level: returns 1 if claimed successfully, 0 if already claimed/race condition.
     */
    @Modifying
    @Transactional
    @Query("UPDATE InvitedParty p SET p.status = 'REGISTERED', p.primaryEmail = :email, p.authToken = :authToken, p.registeredAt = :registeredAt, p.isVerified = true WHERE p.id = :id AND p.status = 'UNUSED'")
    int claimInvitationAtomically(
        @Param("id") Long id,
        @Param("email") String email,
        @Param("authToken") String authToken,
        @Param("registeredAt") LocalDateTime registeredAt
    );
}
