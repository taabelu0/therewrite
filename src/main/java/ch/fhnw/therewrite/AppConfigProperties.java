package ch.fhnw.therewrite;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfigProperties {
    private String access;
    private String url;
    private static final String SEPARATOR = ",";

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getAccess() {
        return access;
    }

    public void setAccess(String access) {
        this.access = access;
    }

    public String[] getAccessEndpoints() {
        return access.split(SEPARATOR);
    }

    @Bean
    public CorsFilter corsConfigurationSource() {
        if(this.url == null) return new CorsFilter(new UrlBasedCorsConfigurationSource());
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin(this.url);
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("GET");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        for (String endpoint : getAccessEndpoints()) {
            source.registerCorsConfiguration(endpoint, configuration);
        }
        return new CorsFilter(source);
    }
}
