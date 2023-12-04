package com.example.demo;

import java.util.Date;
import java.util.List;

import com.google.common.collect.Lists;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import java.time.LocalDateTime;

@ShellComponent
@SpringBootApplication
public class DemoApplication {
  @Autowired
  GameRecordsRepository gameRecordsRepository;
  UserInfoRepository userInfoRepository;

  public static void main(String[] args) {
     SpringApplication.run(DemoApplication.class, args);
  }

  @ShellMethod("Saves a GameRecord to Cloud Datastore: save-gameRecord <googleId> <date> <score>")
  public String saveGameRecord(String googleId, Date date, int score) {
      GameRecords savedGameRecord = this.gameRecordsRepository.save(new GameRecords(googleId, date, score));
      return savedGameRecord.toString();
  }

  @ShellMethod("Loads all gameRecords")
  public String findAllGameRecords() {
     Iterable<GameRecords> gameRecords = this.gameRecordsRepository.findAll();
     return Lists.newArrayList(gameRecords).toString();
  }

  @ShellMethod("Loads gameRecords by googleId: find-gamerecords-by-googleId <googleId>")
  public String findGameRecordsByGoogleId(String googleId) {
      List<GameRecords> gameRecords = this.gameRecordsRepository.findByGoogleId(googleId);
      return gameRecords.toString();
  }

  @ShellMethod("Removes all gameRecords")
  public void removeAllGameRecords() {
     this.gameRecordsRepository.deleteAll();
  }

  @ShellMethod("Saves a UserInfo to Cloud Datastore: save-userInfo <googleId> <userName>")
  public String saveUserInfo(String googleId, String userName) {
      UserInfo saveUserInfo = this.userInfoRepository.save(new UserInfo(googleId, userName));
      return saveUserInfo.toString();
  }

  @ShellMethod("Loads all userInfo")
  public String findAllUserInfo() {
      Iterable<UserInfo> userInfo  = this.userInfoRepository.findAll();
      return Lists.newArrayList(userInfo).toString();
  }

  @ShellMethod("Loads UserInfo by googleId: find-userinfo-by-googleId <googleId>")
  public String findUserInfoByGoogleId(String googleId) {
      List<UserInfo> userInfo = this.userInfoRepository.findByGoogleId(googleId);
      return userInfo.toString();
  }
}
