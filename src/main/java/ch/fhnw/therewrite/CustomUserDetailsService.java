package ch.fhnw.therewrite;

import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        System.out.println(user.getEmail());
        System.out.println(user.getPassword());
        return org.springframework.security.core.userdetails.User.builder()
                .passwordEncoder(new BCryptPasswordEncoder()::encode)
                .username(user.getUsername())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
}