package com.moon.pinnamon.authserver.service;

import com.moon.pinnamon.authserver.model.Room;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class RedisServiceImpl implements RedisService {

    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    private String TAG = this.getClass().getName();


    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");

    @Override
    public void makeRoom(Room room) {
        String key = "roomDto:" + room.getId();
        Long time = System.currentTimeMillis();

        Map<String, Object> mapUserDto = new HashMap<>();
        mapUserDto.put("roomName", room.getRoom_name());
        mapUserDto.put("roomMaster", room.getMaster_user());
        mapUserDto.put("roomMember_" + room.getUserGameInfo().getId(), room.getUserGameInfoSerializer());
        mapUserDto.put("roomCreateAt", time.toString());

        redisTemplate.opsForHash().putAll(key, mapUserDto);
    }

    @Override
    public void cancleRoom(Room room) {
        String key = "roomDto:" + room.getId();
        redisTemplate.delete(key);
    }

    @Override
    public void insertUser(Room room) {
        String key = "roomDto:" + room.getId();
        redisTemplate.opsForHash().put(key,
                "roomMember_" + room.getUserGameInfo().getId(),
                room.getUserGameInfoSerializer());
    }

    @Override
    public void deleteUser(Room room) {
        String key = "roomDto:" + room.getId();
        redisTemplate.opsForHash().delete(key,
                "roomMember_" + room.getUserGameInfo().getId());
    }

    @Override
    public List<Map> listRoom() {
        String key = "roomDto:*";
        Set<String> keys = redisTemplate.keys(key);
        List<Map> roomList = new ArrayList<>();
        assert keys != null;
        for (String roomKey : keys) {
            roomList.add(redisTemplate.opsForHash().entries(roomKey));
        }
        return roomList;
    }
}
