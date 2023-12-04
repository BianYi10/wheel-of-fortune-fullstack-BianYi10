package com.example.demo;

import java.util.List;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GameRecordsRepository extends DatastoreRepository<GameRecords, Long>, PagingAndSortingRepository<GameRecords, Long> {
  List<GameRecords> findByGoogleId(String googleId);

  //List<GameRecords> findByGoogleIdOrderByDateDesc(String googleId);
  Page<GameRecords> findByGoogleId(String googleId, Pageable pageable);
  //List<GameRecords> findByOrderByScoreDesc();
  //Page<GameRecords> findByOrderByScoreDesc(Pageable pageable);

}