package ch.fhnw.therewrite;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import ch.fhnw.therewrite.storage.StorageProperties;
import ch.fhnw.therewrite.storage.StorageService;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class TheRewriteApplication {

    public static void main(String[] args) {
        SpringApplication.run(TheRewriteApplication.class, args);
    }

    @Bean
    CommandLineRunner init(StorageService storageService) {
        return (args) -> storageService.init();
    }
}
