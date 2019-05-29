package com.moon.pinnamon.authserver.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class UserGameInfo implements Serializable {
    private Long id;
    private Integer money;
    private int win;
    private int lose;
}
