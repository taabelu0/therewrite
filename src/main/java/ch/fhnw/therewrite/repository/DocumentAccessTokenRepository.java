package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DocumentAccessTokenRepository extends JpaRepository<DocumentAccessToken, UUID> {
    List<DocumentAccessToken> findByDocumentId(Document document);
}
