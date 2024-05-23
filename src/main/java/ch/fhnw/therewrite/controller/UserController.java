package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Role;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.RoleRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final PasswordEncoder pe;

    public UserController(UserRepository userRepository, AuthenticationManager authenticationManager, RoleRepository roleRepository, PasswordEncoder pe) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.roleRepository = roleRepository;
        this.pe = pe;
    }


    @PostMapping("/login")
    public ResponseEntity<Void> Login(@RequestBody LoginData ld) {
        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(ld.username(), ld.password());
        Authentication authenticationResponse =
                this.authenticationManager.authenticate(authenticationRequest);
        System.out.println(authenticationResponse.isAuthenticated());
        System.out.println(authenticationResponse.getPrincipal());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        UUID uId = UUID.fromString(userId);
        Optional<User> u = userRepository.findById(uId);
        if(u.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(u.get());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PostMapping("")
    public ResponseEntity<User> saveUser(@RequestBody RegistrationData rd) {
        try {
            String hashedPassword = pe.encode(rd.password);
            User u = new User();
            u.setUsername(rd.username);
            u.setEmail(rd.email);
            u.setPassword(hashedPassword);
            Role userRole = roleRepository.findByName("ROLE_USER");
            u.setRoles(Set.of(userRole));
            u = userRepository.save(u);
            return ResponseEntity.status(HttpStatus.OK).body(u);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    public static class RegistrationData {
        public String username;
        public String email;
        public String password;
    }

    record LoginData(String username, String password) {

    }
}
