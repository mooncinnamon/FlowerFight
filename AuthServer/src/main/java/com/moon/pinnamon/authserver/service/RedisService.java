package com.moon.pinnamon.authserver.service;

import com.moon.pinnamon.authserver.model.Room;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;



public interface RedisService {
    void makeRoom(Room room);

    void cancleRoom(Room room);

    void insertUser(Room room);

    void deleteUser(Room room);

    List<Map> listRoom();
}


