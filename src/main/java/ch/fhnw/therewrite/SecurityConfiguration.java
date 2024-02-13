package ch.fhnw.therewrite;

import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;

    public SecurityConfiguration(GuestRepository guestRepository, DocumentRepository documentRepository) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
    }

    @Bean
    public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/public/**").permitAll()
                    .anyRequest().authenticated()
            )
            .sessionManagement((session) -> session
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            // authorization without login (guest):
            .addFilterBefore(
                    new GuestFilter(guestRepository, documentRepository),
                    UsernamePasswordAuthenticationFilter.class
            );
        return http.build();
    }
}
