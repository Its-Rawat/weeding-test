package com.wedding.invitation.repository;

import com.wedding.invitation.model.GuestInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuestInvitationRepository extends JpaRepository<GuestInvitation, Long> {

    Optional<GuestInvitation> findByToken(String token);

    boolean existsByToken(String token);

    List<GuestInvitation> findAllByOrderByCreatedAtDesc();
}
