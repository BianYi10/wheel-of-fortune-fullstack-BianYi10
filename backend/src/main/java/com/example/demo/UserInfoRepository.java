package com.example.demo;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;

import java.util.List;


public interface UserInfoRepository extends DatastoreRepository<UserInfo, Long> {

  List<UserInfo> findByGoogleId(String googleId);

}