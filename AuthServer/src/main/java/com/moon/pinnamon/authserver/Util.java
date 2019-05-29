package com.moon.pinnamon.authserver;

import com.moon.pinnamon.authserver.model.UserGameInfo;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.Base64;

public class Util {
    public static UserGameInfo convertUserGameInfo(String s){
        byte[] serializedMember = Base64.getDecoder().decode(s);
        try (ByteArrayInputStream bais = new ByteArrayInputStream(serializedMember)) {
            try (ObjectInputStream ois = new ObjectInputStream(bais)) {
                Object objectMember = ois.readObject();
                return (UserGameInfo) objectMember;
            }
        } catch (Exception e) {
            return null;
        }
    }
}
