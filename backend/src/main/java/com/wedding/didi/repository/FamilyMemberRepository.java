package com.wedding.didi.repository;

import com.wedding.didi.model.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    List<FamilyMember> findByPartyIdOrderByIdAsc(Long partyId);
    void deleteByPartyId(Long partyId);
    long countByIsAttendingFalse();
    long countByIsAttendingTrue();
    List<FamilyMember> findByIsAttendingFalse();
}
