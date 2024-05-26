package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Role findByName(String name);
}
