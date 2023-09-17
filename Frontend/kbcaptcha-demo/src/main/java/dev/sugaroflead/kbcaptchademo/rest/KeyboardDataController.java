package dev.sugaroflead.kbcaptchademo.rest;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.hc.client5.http.ClientProtocolException;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.HttpException;
import org.apache.hc.core5.http.NameValuePair;
import org.apache.hc.core5.http.io.HttpClientResponseHandler;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.sugaroflead.kbcaptchademo.model.KeyboardData;

@RestController
public class KeyboardDataController {

    @Value("${backendIP:http://localhost:5000}")
    private String backendIP;

    @PostMapping("/results")
    public ResponseEntity<Map<String, String>> processResults(@RequestBody KeyboardData keyboardData) {

        Map<String, String> response = new HashMap<>();


        ObjectMapper objectMapper = new ObjectMapper();
    
        try {
            CloseableHttpClient httpClient = HttpClients.createDefault();
            HttpPost post = new HttpPost(backendIP);
            post.setHeader("Content-Type", "application/json");

            String JsonResult = objectMapper.writeValueAsString(keyboardData);
            StringEntity entity = new StringEntity(JsonResult, ContentType.APPLICATION_JSON);
            post.setEntity(entity);

            HttpClientResponseHandler<String> responseHandler = new HttpClientResponseHandler<String>() {
                @Override
                public String handleResponse(final ClassicHttpResponse response) throws IOException {
                    int status = response.getCode();
                    HttpEntity entity = response.getEntity();
                    if (status >= 200 && status < 300) {
                        try {
                            return entity != null ? EntityUtils.toString(entity) : null;
                        } catch (Exception e) {
                            return null;
                        }
                    } else {
                        throw new ClientProtocolException("Unexpected response status: " + status);
                    }
                }
            };

            String responseBody = httpClient.execute(post, responseHandler);
            Map<String, Double> resultMap = objectMapper.readValue(responseBody, Map.class);
            Double botLikelihood = resultMap.get("result");

            response.put("score", Math.floor(botLikelihood * 100) + "");
            System.out.println(responseBody);
        }
        catch (Exception e) {
            e.printStackTrace(); 
        }


        response.put("status", "success");

        return new ResponseEntity<Map<String,String>>(response, HttpStatus.CREATED);
    }   
}
