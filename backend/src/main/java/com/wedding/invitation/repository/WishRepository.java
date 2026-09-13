package com.wedding.invitation.repository;

import com.wedding.invitation.model.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishRepository extends JpaRepository<Wish, Long> {

    List<Wish> findAllByOrderByCreatedAtDesc();

    Optional<Wish> findByName(String name);

    @Modifying
    @Query("DELETE FROM Wish w WHERE w.id IN :ids")
    void deleteAllByIdIn(@Param("ids") List<Long> ids);
}
