package com.moon.pinnamon.authserver;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
class LoginBody {
    String usernameOrEmail;
    String password;
}

@Setter
@Getter
class RegistBody{
    String name;
    String username;
    String email;
    String password;
}

public class TestUtils {
    public static LoginBody createBody(String id, String pw) {
        LoginBody loginBody = new LoginBody();
        loginBody.setUsernameOrEmail(id);
        loginBody.setPassword(pw);
        return loginBody;
    }

    public static RegistBody createRegistBody(String name, String username, String email, String pw) {
        RegistBody registBody = new RegistBody();
        registBody.setName(name);
        registBody.setUsername(username);
        registBody.setEmail(email);
        registBody.setPassword(pw);
        return registBody;
    }
}

