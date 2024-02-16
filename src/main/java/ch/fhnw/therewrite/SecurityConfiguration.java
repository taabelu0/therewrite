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
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

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
                    .requestMatchers("/view/**").authenticated()
                    // TODO: on user management implementation change this to be secure!! (.anyRequest().authenticated())
                    .anyRequest().permitAll()
            )
            .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // cookie-based CSRF token repository
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
