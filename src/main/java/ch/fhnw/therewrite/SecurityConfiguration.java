package ch.fhnw.therewrite;

import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.*;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;
    private final DocumentAccessTokenRepository documentAccessTokenRepository;

    public SecurityConfiguration(GuestRepository guestRepository, DocumentRepository documentRepository, DocumentAccessTokenRepository documentAccessTokenRepository) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
        this.documentAccessTokenRepository = documentAccessTokenRepository;
    }

    @Bean
    public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/view/**").authenticated()
                        .requestMatchers("/api/document/all").permitAll()
                        .requestMatchers("/api/index").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        // TODO: on user management implementation change this to be secure!! (.anyRequest().authenticated())
                        .anyRequest().permitAll()
                )
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                // authorization without login (guest):
                .addFilterBefore(
                        new GuestFilter(guestRepository, documentRepository, documentAccessTokenRepository),
                        UsernamePasswordAuthenticationFilter.class
                );
        return http.build();
    }
}

