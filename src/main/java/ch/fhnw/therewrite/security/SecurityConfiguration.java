package ch.fhnw.therewrite.security;

import ch.fhnw.therewrite.AppConfigProperties;
import ch.fhnw.therewrite.CustomUserDetailsService;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;
    private final DocumentAccessTokenRepository documentAccessTokenRepository;
    private final AppConfigProperties appConfig;
    private final CustomUserDetailsService cuds;
    public static final List<String> permitAllMatchers = List.of(
            "/api/user",
            "/api/user/login",
            "/",
            "/login",
            "/registration",
            "/static/**"
    );

    public SecurityConfiguration(UserRepository userRepository, GuestRepository guestRepository, DocumentRepository documentRepository, DocumentAccessTokenRepository documentAccessTokenRepository, AppConfigProperties appConfig, CustomUserDetailsService cuds) {
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
        this.documentAccessTokenRepository = documentAccessTokenRepository;
        this.appConfig = appConfig;
        this.cuds = cuds;
    }

    @Bean
    public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> {
                    for (String matcher : permitAllMatchers) {
                        auth.requestMatchers(matcher).permitAll();
                    }
                    auth.anyRequest().authenticated();
                })
                .addFilterBefore(
                        new GuestFilter(guestRepository, userRepository, documentRepository, documentAccessTokenRepository, cuds),
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterAt(customUsernamePasswordAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/api/user/login")
                        .failureUrl("/login?error=true")
                        .successHandler(appAuthenticationSuccessHandler())
                        .permitAll()
                )
                .authenticationManager(authenticationManager())
                .csrf(csrf -> csrf.disable())
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .addFilterBefore(
                        appConfig.corsConfigurationSource(),
                        GuestFilter.class);
        return http.build();
    }

    @Bean
    public CustomUsernamePasswordAuthenticationFilter customUsernamePasswordAuthenticationFilter() throws Exception {
        CustomUsernamePasswordAuthenticationFilter filter = new CustomUsernamePasswordAuthenticationFilter(authenticationManager());
        return filter;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(passwordEncoder());
        authProvider.setUserDetailsService(this.cuds);
        return new ProviderManager(authProvider);
    }

    @Bean
    public AuthenticationSuccessHandler appAuthenticationSuccessHandler(){
        return new AuthenticationSuccessHandler();
    }
}
