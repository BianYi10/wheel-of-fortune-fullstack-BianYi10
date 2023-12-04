package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/UserInfo")
public class UserInfoController {
  private final UserInfoRepository userInfoRepository;

  public UserInfoController(UserInfoRepository userInfoRepository) {
    this.userInfoRepository = userInfoRepository;
  }

  @PostMapping("/saveUserInfo")
  @CrossOrigin(origins = "*")
  public String saveUserInfo(@RequestBody UserInfo userInfo) {
    if (userInfo == null) {
      return "The userInfo are invalid";
    }
    this.userInfoRepository.save(userInfo);
    return "success";
  }

  @GetMapping("/findAllUserInfo")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<UserInfo> findAllUserInfo() {
  	Iterable<UserInfo> userInfo = this.userInfoRepository.findAll();
    List<UserInfo> userInfoList = new ArrayList<>();
    userInfo.forEach(userInfoList::add);
    return userInfoList;
  }

  @GetMapping("/findUserInfoByGoogleId")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<UserInfo> findUserInfoByGoogleId(@RequestParam String googleId) {
    Iterable<UserInfo> userInfo = this.userInfoRepository.findByGoogleId(googleId);
    List<UserInfo> userInfoList = new ArrayList<>();
    userInfo.forEach(userInfoList::add);
    return userInfoList;
  }

/*
@GetMapping("/api/UserInfo/findUserInfoByGoogleId")
public ResponseEntity<?> findUserInfoByGoogleId(@RequestParam String googleId) {
  Iterable<UserInfo> userInfo = this.userInfoRepository.findByGoogleId(googleId);
  if (!userInfo.iterator().hasNext()) {
    // 如果 googleId 在数据库中不存在
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found for googleId: " + googleId);
  }
  List<UserInfo> userInfoList = new ArrayList<>();
  userInfo.forEach(userInfoList::add);
  return ResponseEntity.ok(userInfo);
}
*/

/*
  @PostMapping("/updateUserName")
  @CrossOrigin(origins = "*")
  public String updateUserName(@RequestParam String googleId, @RequestParam String userName) {
    List<UserInfo> userInfoList = userInfoRepository.findByGoogleId(googleId);
    UserInfo userInfo;
    if (userInfoList.isEmpty()) {
      //userInfo= new UserInfo(googleId,userName);
      return "No userInfo found for googleId: " + googleId;
    } else{
      userInfo = userInfoList.get(0);
      userInfo.setUserName(userName);
    }

    userInfoRepository.save(userInfo);

    return "success";
  }
*/
@PostMapping("/updateUserName")
@CrossOrigin(origins = "*")
public String updateUserName(@RequestParam String googleId, @RequestParam String userName) {
  List<UserInfo> userInfoList = userInfoRepository.findByGoogleId(googleId);
  UserInfo userInfo;
  if (userInfoList.isEmpty()) {
    //userInfo= new UserInfo(googleId,userName);
    return "No userInfo found for googleId: " + googleId;
  } else{
    userInfo = userInfoList.get(0);
    userInfo.setUserName(userName);
  }

  userInfoRepository.save(userInfo);

  return "success";
}

}