package ch.fhnw.therewrite;

import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;
    private final DocumentAccessTokenRepository documentAccessTokenRepository;
    private final AppConfigProperties appConfig;
    public static final List<String> permitAllMatchers = List.of(
            "/api/document/**",
            "/api/document/",
            "/api/documentAccessToken/create",
            "/",
            "/home",
            "/static/**"
    );

    public SecurityConfiguration(GuestRepository guestRepository, DocumentRepository documentRepository, DocumentAccessTokenRepository documentAccessTokenRepository, AppConfigProperties appConfig) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
        this.documentAccessTokenRepository = documentAccessTokenRepository;
        this.appConfig = appConfig;
    }

    @Bean
    public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> {
                    for (String matcher : permitAllMatchers) {
                        auth.requestMatchers(matcher).permitAll();
                    }
                    auth.anyRequest().authenticated();
                })
                .csrf(csrf -> csrf.disable())
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                // authorization without login (guest):
                .addFilterBefore(
                        new GuestFilter(guestRepository, documentRepository, documentAccessTokenRepository),
                        UsernamePasswordAuthenticationFilter.class
                )
                .addFilterBefore(
                        appConfig.corsConfigurationSource(),
                        GuestFilter.class);
        return http.build();
    }
}
