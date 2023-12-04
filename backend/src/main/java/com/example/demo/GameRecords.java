package com.example.demo;

import java.util.Date;
import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import org.springframework.data.annotation.Id;

@Entity(name = "GameRecords")
public class GameRecords {
  @Id
  private Long id;

  private String googleId;

  //String date;
  //private Date date;
  private Date date;

  private int score;

  public GameRecords(String googleId, Date  date, int score) {
    this.googleId = googleId;
    this.date = date;
    this.score = score;
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
  public Date  getDate() {
  	return this.date;
  }
  
  public void setDate(Date  date) {
  	this.date=date;
  }
  
  public int getScore() {
  	return this.score;
  }
  
  public void setScore(int score) {
  	this.score=score;
  }
  

  @Override
  public String toString() {
    return "{" +
        "id:" + this.id +
        ", googleId:'" + this.googleId + '\'' +
        ", date:'" + this.date + '\'' +
        ", score:" + this.score +
        '}';
  }
}