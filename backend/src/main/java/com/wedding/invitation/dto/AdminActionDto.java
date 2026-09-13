package com.wedding.invitation.dto;

import java.util.List;
import java.util.Map;

public class AdminActionDto {

    private String action;
    private Long id;
    private List<Long> ids;
    private Map<String, Object> data;

    public AdminActionDto() {}

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }
}
