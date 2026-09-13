package com.wedding.invitation.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AttendanceStatus {
    HADIR("hadir"),
    TIDAK_HADIR("tidak_hadir"),
    RAGU("ragu");

    private final String value;

    AttendanceStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static AttendanceStatus fromValue(String value) {
        if (value == null) return HADIR;
        for (AttendanceStatus status : values()) {
            if (status.value.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        return HADIR;
    }
}
