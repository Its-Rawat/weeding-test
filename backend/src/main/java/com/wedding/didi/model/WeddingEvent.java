package com.wedding.didi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wedding_events")
public class WeddingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String venueName;

    private String venueAddress;

    private String mapUrl;

    private String dressCode;

    @Column(length = 1000)
    private String description;

    private String icon;

    private Integer orderIndex;

    public WeddingEvent() {}

    public WeddingEvent(String title, String subtitle, String date, String time, String venueName, 
                        String venueAddress, String mapUrl, String dressCode, String description, 
                        String icon, Integer orderIndex) {
        this.title = title;
        this.subtitle = subtitle;
        this.date = date;
        this.time = time;
        this.venueName = venueName;
        this.venueAddress = venueAddress;
        this.mapUrl = mapUrl;
        this.dressCode = dressCode;
        this.description = description;
        this.icon = icon;
        this.orderIndex = orderIndex;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getVenueAddress() {
        return venueAddress;
    }

    public void setVenueAddress(String venueAddress) {
        this.venueAddress = venueAddress;
    }

    public String getMapUrl() {
        return mapUrl;
    }

    public void setMapUrl(String mapUrl) {
        this.mapUrl = mapUrl;
    }

    public String getDressCode() {
        return dressCode;
    }

    public void setDressCode(String dressCode) {
        this.dressCode = dressCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}
