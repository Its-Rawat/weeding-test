package com.wedding.invitation.repository;

import com.wedding.invitation.model.AppConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppConfigRepository extends JpaRepository<AppConfigEntity, String> {
    Optional<AppConfigEntity> findByKey(String key);
}
