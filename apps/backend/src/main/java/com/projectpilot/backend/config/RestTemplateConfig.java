package com.projectpilot.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP client configuration for AI microservice communication.
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(
            @Value("${ai-service.timeout-seconds:30}") int timeoutSeconds) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000); // 10 seconds
        factory.setReadTimeout(timeoutSeconds * 1000);
        return new RestTemplate(factory);
    }
}
