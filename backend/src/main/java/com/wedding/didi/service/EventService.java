package com.wedding.didi.service;

import com.wedding.didi.model.WeddingEvent;
import com.wedding.didi.repository.WeddingEventRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {

    private final WeddingEventRepository weddingEventRepository;

    public EventService(WeddingEventRepository weddingEventRepository) {
        this.weddingEventRepository = weddingEventRepository;
    }

    public List<WeddingEvent> getAllEvents() {
        return weddingEventRepository.findAllByOrderByOrderIndexAsc();
    }

    public WeddingEvent saveEvent(WeddingEvent event) {
        return weddingEventRepository.save(event);
    }
}
