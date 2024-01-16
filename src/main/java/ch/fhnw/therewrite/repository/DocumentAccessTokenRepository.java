package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.DocumentAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DocumentAccessTokenRepository extends JpaRepository<DocumentAccessToken, UUID> {
}
