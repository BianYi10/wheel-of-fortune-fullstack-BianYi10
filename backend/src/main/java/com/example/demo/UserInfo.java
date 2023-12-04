package com.example.demo;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import org.springframework.data.annotation.Id;

@Entity(name = "UserInfo")
public class UserInfo {
  @Id
  Long id;

  String googleId;

  String userName;


  public UserInfo(String googleId, String userName) {
    this.googleId = googleId;
    this.userName = userName;
  }

  public long getId() {
    return this.id;
  }
  
  public void setId(Long id) {
  	this.id=id;
  }
  
  public String getGoogleId() {
  	return this.googleId;
  }
  
  public void setGoogleId(String googleId) {
  	this.googleId=googleId;
  }
   public String getUserName() {
  	return this.userName;
  }
  
  public void setUserName(String userName) {
  	this.userName=userName;
  }

  @Override
  public String toString() {
    return "{" +
        "id:" + this.id +
        ", googleId:'" + this.googleId + '\'' +
        ", userName:'" + this.userName + '\'' +
        '}';
  }
}