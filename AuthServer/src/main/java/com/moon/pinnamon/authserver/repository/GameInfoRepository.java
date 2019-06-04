package com.moon.pinnamon.authserver.repository;

import com.moon.pinnamon.authserver.model.GameInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameInfoRepository extends CrudRepository<GameInfo, Long> {
}
