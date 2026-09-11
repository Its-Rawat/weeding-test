package com.wedding.didi.controller;

import com.wedding.didi.model.GuestWish;
import com.wedding.didi.service.WishService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishes")
@CrossOrigin(origins = "*")
public class WishController {

    private final WishService wishService;

    public WishController(WishService wishService) {
        this.wishService = wishService;
    }

    @GetMapping
    public ResponseEntity<List<GuestWish>> getWishes() {
        return ResponseEntity.ok(wishService.getAllWishes());
    }

    @PostMapping
    public ResponseEntity<GuestWish> submitWish(@Valid @RequestBody GuestWish wish) {
        return ResponseEntity.ok(wishService.addWish(wish));
    }
}
