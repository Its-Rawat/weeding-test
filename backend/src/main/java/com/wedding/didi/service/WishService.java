package com.wedding.didi.service;

import com.wedding.didi.model.GuestWish;
import com.wedding.didi.repository.GuestWishRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WishService {

    private final GuestWishRepository guestWishRepository;

    public WishService(GuestWishRepository guestWishRepository) {
        this.guestWishRepository = guestWishRepository;
    }

    public List<GuestWish> getAllWishes() {
        return guestWishRepository.findAllByOrderByCreatedAtDesc();
    }

    public GuestWish addWish(GuestWish wish) {
        return guestWishRepository.save(wish);
    }
}
