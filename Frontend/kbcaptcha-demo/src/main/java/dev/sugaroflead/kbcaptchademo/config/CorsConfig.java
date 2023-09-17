package dev.sugaroflead.kbcaptchademo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${backendIP:http://localhost:5000}")
    private String backendIP;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("Allowing CORS for: " + backendIP);
        String allowedOrigin = backendIP;
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigin)
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}