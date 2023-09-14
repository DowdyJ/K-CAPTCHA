package dev.sugaroflead.kbcaptchademo.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import dev.sugaroflead.kbcaptchademo.model.KeyboardData;

@RestController
public class KeyboardDataController {
    @PostMapping("/results")
    public ResponseEntity<Map<String, String>> processResults(@RequestBody List<KeyboardData> keyboardData) {

        for (KeyboardData kbd : keyboardData) {
            System.out.println(
                "KeyCode:" + kbd.current_character_code + 
                ",\t TimeHeld: " + kbd.time_held + 
                ",\t PrevCharCode: " + kbd.previous_character_code +
                ",\t OverLap: " + kbd.is_overlapping +
                ",\t SLKTime: " + kbd.time_since_last_keypress +
                ",\t AvgTime: " + kbd.average_time_between_strokes);
        }


        Map<String, String> response = new HashMap<>();
        response.put("status", "success");

        return new ResponseEntity<Map<String,String>>(response, HttpStatus.CREATED);
    }   
}
