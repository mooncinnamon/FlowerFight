package com.moon.pinnamon.authserver.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Setter
@Entity
@Table(name = "gameinfos")
public class GameInfo {
    @Id
    private Long id;
    @NotBlank
    @Size(max = 15)
    private String username;

    private int money;
}
