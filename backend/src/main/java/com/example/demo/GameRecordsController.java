package com.example.demo;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/GameRecords")
public class GameRecordsController {
  private final GameRecordsRepository gameRecordsRepository;

  public GameRecordsController(GameRecordsRepository gameRecordsRepository) {
    this.gameRecordsRepository = gameRecordsRepository;
  }

  @PostMapping("/saveGameRecord")
  @CrossOrigin(origins = "*")
  public String saveGameRecord(@RequestBody GameRecords gameRecord) {
    if (gameRecord == null) {
      return "The gameRecords are invalid";
    }
    this.gameRecordsRepository.save(gameRecord);
    return "success";
  }

  @GetMapping("/findAllGameRecords")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<GameRecords> findAllGameRecords() {
  	Iterable<GameRecords> gameRecords = this.gameRecordsRepository.findAll();
    List<GameRecords> gameRecordsList = new ArrayList<>();
    gameRecords.forEach(gameRecordsList::add);
    return gameRecordsList;
  }

  @GetMapping("/findGameRecordsByGoogleId")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<GameRecords> findGameRecordsByGoogleId(@RequestParam String googleId) {
    Iterable<GameRecords> gameRecords = this.gameRecordsRepository.findByGoogleId(googleId);
    List<GameRecords> gameRecordsList = new ArrayList<>();
    gameRecords.forEach(gameRecordsList::add);
    return gameRecordsList;
  }

  @PostMapping("/removeAllGameRecords")
  @CrossOrigin(origins = "*")
  public String removeAllGameRecords() {
    gameRecordsRepository.deleteAll();
    return "All game records have been removed";
  }

  @PostMapping("/removeGameRecordByGoogleId")
  @CrossOrigin(origins = "*")
  public String removeGameRecordByGoogleId(@RequestParam String googleId) {
    Iterable<GameRecords> recordsToDelete = gameRecordsRepository.findByGoogleId(googleId);
    if (!recordsToDelete.iterator().hasNext()) {
      return "No game records found for googleId: " + googleId;
    }
    gameRecordsRepository.deleteAll(recordsToDelete);
    return "Game records with googleId " + googleId + " have been removed";
  }

  @PostMapping("/removeGameRecordById")
  @CrossOrigin(origins = "*")
  public String removeGameRecordById(@RequestParam Long id) {
    if (!gameRecordsRepository.existsById(id)) {
      return "Game record not found with id: " + id;
    }
    gameRecordsRepository.deleteById(id);
    return "success";
  }

  /*
  @GetMapping("/findGameRecordsOrderByScoreDesc")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public Page<GameRecords> findGameRecordsOrderByScoreDesc(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size);
    return gameRecordsRepository.findByOrderByScoreDesc(pageable);
  }
  */

  @GetMapping("/findGameRecordsByGoogleIdOrderByDateDesc")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public Page<GameRecords> findGameRecordsByGoogleIdOrderByDateDesc(
          @RequestParam String googleId,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size,
          @RequestParam(defaultValue = "date") String sortField,
          @RequestParam(defaultValue = "desc") String sortDirection) {
    Sort.Direction direction = Sort.Direction.fromString(sortDirection);
    Sort sort = Sort.by(direction, sortField);
    Pageable pageable = PageRequest.of(page, size, sort);
    return gameRecordsRepository.findByGoogleId(googleId,pageable);
  }

  /*
  @GetMapping("/findGameRecordsByGoogleIdOrderByDateDesc")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public Page<GameRecords> findGameRecordsByGoogleIdOrderByDateDesc(
          @RequestParam String googleId,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
    return gameRecordsRepository.findByGoogleIdOrderByDateDesc(googleId, pageable);
  }
*/

  @GetMapping("/findGameRecordsOrderByScoreDesc")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public Page<GameRecords> findGameRecordsOrderByScoreDesc(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size,
          @RequestParam(defaultValue = "score") String sortField,
          @RequestParam(defaultValue = "desc") String sortDirection) {
    Sort.Direction direction = Sort.Direction.fromString(sortDirection);
    Sort sort = Sort.by(direction, sortField);
    Pageable pageable = PageRequest.of(page, size, sort);
    return gameRecordsRepository.findAll(pageable);
  }


}