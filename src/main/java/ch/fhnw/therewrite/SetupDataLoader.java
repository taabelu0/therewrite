package ch.fhnw.therewrite;

import ch.fhnw.therewrite.data.Role;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.RoleRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Set;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private Environment env;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if(!Arrays.stream(env.getActiveProfiles()).anyMatch(p -> p.equals("dev")) || alreadySetup) {
            return;
        }
        createRoleIfNotFound("ROLE_ADMIN");
        createRoleIfNotFound("ROLE_USER");
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        Role userRole = roleRepository.findByName("ROLE_USER");
        User user = new User();
        user.setUsername("admin");
        user.setPassword(passwordEncoder.encode("test123"));
        user.setEmail("test@test.com");
        user.setRoles(Set.of(adminRole, userRole));
        if(userRepository.findByUsername(user.getUsername()) == null) {
            userRepository.save(user);
        }
        alreadySetup = true;
    }

    @Transactional
    Role createRoleIfNotFound(String name) {
        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
        return role;
    }
}