package com.moon.pinnamon.authserver.payload;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserSummary {
    private Long id;
    private String username;
    private String name;

    public UserSummary(Long id, String username, String name) {
        this.id = id;
        this.username = username;
        this.name = name;
    }
}
