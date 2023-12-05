package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
