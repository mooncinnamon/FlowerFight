package com.moon.pinnamon.authserver.model;

import com.moon.pinnamon.authserver.Util;
import lombok.Getter;
import lombok.Setter;

import java.io.*;
import java.util.Base64;

@Getter
@Setter
public class Room {
    private Long id;
    private String room_name;
    private String master_user;
    private String userGameInfoSerializerBase64;

    public void setUserGameInfo(UserGameInfo userGameInfo){
        byte[] serializedMember = new byte[0];
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
                oos.writeObject(userGameInfo);
                // serializedMember -> 직렬화된 member 객체
                serializedMember = baos.toByteArray();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        userGameInfoSerializerBase64 = Base64.getEncoder().encodeToString(serializedMember);
    }

    public String getUserGameInfoSerializer() {
       return userGameInfoSerializerBase64;
    }

    public UserGameInfo getUserGameInfo(){
        return Util.convertUserGameInfo(userGameInfoSerializerBase64);
    }
}
