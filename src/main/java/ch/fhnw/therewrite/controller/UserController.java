package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getAnnotationsByDocumentId(@PathVariable String userId) {
        UUID uId = UUID.fromString(userId);
        Optional<User> u = userRepository.findById(uId);
        if(u.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(u.get());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PostMapping("")
    public User saveUser(@RequestBody RegistrationData rd) {
        User u = new User();
        u.setUsername(rd.username);
        u.setEmail(rd.email);
        u.setPassword(rd.password); // TODO: needs hashing
        return userRepository.save(u);
    }

    public static class RegistrationData {
        public String username;
        public String email;
        public String password;
    }
}
