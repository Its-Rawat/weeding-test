package com.wedding.invitation.controller;

import com.wedding.invitation.dto.WishDto;
import com.wedding.invitation.model.Wish;
import com.wedding.invitation.service.WishService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishes")
public class WishController {

    private final WishService wishService;

    public WishController(WishService wishService) {
        this.wishService = wishService;
    }

    @GetMapping
    public ResponseEntity<List<Wish>> getAllWishes() {
        return ResponseEntity.ok(wishService.getAllWishes());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitWish(@Valid @RequestBody WishDto dto) {
        Map<String, Object> result = wishService.saveOrUpdateWish(dto);
        return ResponseEntity.ok(result);
    }
}
