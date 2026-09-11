package com.wedding.didi.repository;

import com.wedding.didi.model.GuestWish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GuestWishRepository extends JpaRepository<GuestWish, Long> {
    List<GuestWish> findAllByOrderByCreatedAtDesc();
}
