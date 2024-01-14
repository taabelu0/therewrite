package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GuestRepository extends JpaRepository<Guest, UUID> {
}
